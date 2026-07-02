import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButtons, IonBackButton, IonSpinner,
  IonModal, IonButton,
  ToastController
} from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router'; 
import { addIcons } from 'ionicons';
import {
  cubeOutline, trashOutline, addOutline, removeOutline,
  addCircleOutline, documentTextOutline, personOutline,
  callOutline, arrowBackOutline, pricetagOutline
} from 'ionicons/icons';

import { CotizacionService } from '../../../services/cotizacion.service';
import { ProductosService, Producto } from '../../../services/productos.service';
import { ItemCotizacion } from '../../../models/cotizacion.model';

type ProductoCatalogo = Pick<Producto, 'id' | 'nombre' | 'precio' | 'imagen'>;

@Component({
  selector: 'app-generar-cotizacion',
  templateUrl: './generar-cotizacion.page.html',
  styleUrls: ['./generar-cotizacion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, DecimalPipe,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonIcon, IonButtons, IonBackButton, IonSpinner,
    IonModal, IonButton
  ]
})
export class GenerarCotizacionPage implements OnInit {
  private cotizacionService = inject(CotizacionService);
  private productosService = inject(ProductosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);

  // Control de Rol
  esEmpleado = false; 

  // Estado del formulario
  itemsSeleccionados: ItemCotizacion[] = [];
  clienteNombre   = '';
  clienteTelefono = '';
  isLoading       = false;
  modalCatalogoAbierto = false;

  // Totales calculados
  subtotalBase = 0;
  descuentoPorcentaje = 0;
  descuentoMonto = 0;
  subtotal = 0;
  igv      = 0;
  total    = 0;

  // Catálogo cargado desde el servicio
  catalogoProductos: ProductoCatalogo[] = [];

  constructor() {
    addIcons({
      cubeOutline, trashOutline, addOutline, removeOutline,
      addCircleOutline, documentTextOutline, personOutline,
      callOutline, arrowBackOutline, pricetagOutline
    });

    const productosRaw = this.productosService.getAll();
    this.catalogoProductos = Array.isArray(productosRaw) ? productosRaw : [];
  }

  ngOnInit() {
    const rolActual = localStorage.getItem('ksk_rol');
    this.esEmpleado = (rolActual === 'empleado');

    if (!this.esEmpleado) {
      this.cargarDatosClienteLogueado();
    } else {
      this.clienteNombre = '';
      this.clienteTelefono = '';
    }
  }

  cargarDatosClienteLogueado() {
    this.clienteNombre = 'Juan Pérez (Cliente)';
    this.clienteTelefono = '987654321';
  }

  // Modal catálogo
  abrirCatalogo()  { this.modalCatalogoAbierto = true;  }
  cerrarCatalogo() { this.modalCatalogoAbierto = false; }

  // Agregar producto desde el modal
  agregarProducto(p: ProductoCatalogo) {
    const existe = this.itemsSeleccionados.find(i => i.id === p.id);

    if (existe) {
      this.incrementar(existe);
    } else {
      this.itemsSeleccionados.push({
        id:       p.id,
        nombre:   p.nombre,
        precio:   p.precio,
        cantidad: 1,
        subtotal: p.precio,
        imagen:   p.imagen
      });
    }

    this.calcularTotales();
    this.cerrarCatalogo();
  }

  // Controles de cantidad
  incrementar(item: ItemCotizacion) {
    item.cantidad++;
    item.subtotal = Math.round(item.precio * item.cantidad * 100) / 100;
    this.calcularTotales();
  }

  decrementar(item: ItemCotizacion) {
    if (item.cantidad <= 1) {
      this.removeItem(item.id);
      return;
    }
    item.cantidad--;
    item.subtotal = Math.round(item.precio * item.cantidad * 100) / 100;
    this.calcularTotales();
  }

  removeItem(id: string) {
    this.itemsSeleccionados = this.itemsSeleccionados.filter(i => i.id !== id);
    this.calcularTotales();
  }

  // Calcular subtotal, descuento, IGV y total
  calcularTotales() {
    this.subtotalBase = Math.round(
      this.itemsSeleccionados.reduce((acc, i) => acc + i.subtotal, 0) * 100
    ) / 100;

    // Rango seguro de descuento (0 a 99%)
    if (this.descuentoPorcentaje < 0) this.descuentoPorcentaje = 0;
    if (this.descuentoPorcentaje > 99) this.descuentoPorcentaje = 99;

    this.descuentoMonto = Math.round(this.subtotalBase * (this.descuentoPorcentaje / 100) * 100) / 100;
    this.subtotal = Math.round((this.subtotalBase - this.descuentoMonto) * 100) / 100;
    this.igv   = Math.round(this.subtotal * 0.18 * 100) / 100;
    this.total = Math.round((this.subtotal + this.igv) * 100) / 100;
  }

  async generarCotizacion() {
    if (this.itemsSeleccionados.length === 0 || !this.clienteNombre.trim()) return;

    this.isLoading = true;

    setTimeout(async () => {
      const cotizacion = this.cotizacionService.create(
        this.itemsSeleccionados,
        {
          nombre:   this.clienteNombre.trim(),
          telefono: this.clienteTelefono.trim()
        },
        this.descuentoPorcentaje
      );

      this.isLoading = false;
      this.router.navigate(['/resumen-cotizacion', cotizacion.id]);
    }, 1000);
  }
}