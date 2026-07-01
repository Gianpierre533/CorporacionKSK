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
  callOutline, arrowBackOutline
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


  // ── Control de Rol ──────────────────────────────────────
  esEmpleado = false; 

  // ── Estado del formulario ──────────────────────────────
  itemsSeleccionados: ItemCotizacion[] = [];
  clienteNombre   = '';
  clienteTelefono = ''; // 👈 Unificado en español para hacer match con el HTML
  isLoading       = false;
  modalCatalogoAbierto = false;

  // ── Totales calculados ─────────────────────────────────
  subtotal = 0;
  igv      = 0;
  total    = 0;

  // ── Catálogo cargado desde el servicio ────────────────
  catalogoProductos: ProductoCatalogo[] = [];

  constructor() {
    addIcons({
      cubeOutline, trashOutline, addOutline, removeOutline,
      addCircleOutline, documentTextOutline, personOutline,
      callOutline, arrowBackOutline
    });

    const productosRaw = this.productosService.getAll();
    this.catalogoProductos = Array.isArray(productosRaw) ? productosRaw : [];
  }

  ngOnInit() {
    // ── CORRECCIÓN DE DETECCIÓN DE ROL ──
    const rolActual = localStorage.getItem('ksk_rol');
    
    // Si eres empleado, eres parte del personal interno de la empresa
    this.esEmpleado = (rolActual === 'empleado');

    if (!this.esEmpleado) {
      // Si realmente es un cliente externo, bloqueamos con sus datos fijos
      this.cargarDatosClienteLogueado();
    } else {
      // Si eres empleado, dejamos los campos vacíos y limpios para que escribas el cliente que quieras
      this.clienteNombre = '';
      this.clienteTelefono = '';
    }
  }

  // ── Cargar Perfil Automático (Solo para Clientes) ───────
  cargarDatosClienteLogueado() {
    this.clienteNombre = 'Juan Pérez (Cliente)';
    this.clienteTelefono = '987654321';
  }

  // ── Modal catálogo ─────────────────────────────────────
  abrirCatalogo()  { this.modalCatalogoAbierto = true;  }
  cerrarCatalogo() { this.modalCatalogoAbierto = false; }

  // ── Agregar producto desde el modal ───────────────────
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

  // ── Controles de cantidad ──────────────────────────────
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

  // ── Calcular subtotal, IGV y total ────────────────────
  private calcularTotales() {
    this.subtotal = Math.round(
      this.itemsSeleccionados.reduce((acc, i) => acc + i.subtotal, 0) * 100
    ) / 100;
    this.igv   = Math.round(this.subtotal * 0.18 * 100) / 100;
    this.total = Math.round((this.subtotal + this.igv) * 100) / 100;
  }

  // ── Generar cotización ─────────────────────────────────
  async generarCotizacion() {
    // Si no hay productos o el nombre del cliente está vacío, detenemos la ejecución
    if (this.itemsSeleccionados.length === 0 || !this.clienteNombre.trim()) return;

    this.isLoading = true;

    setTimeout(async () => {
      const cotizacion = this.cotizacionService.create(
        this.itemsSeleccionados,
        {
          nombre:   this.clienteNombre.trim(),
          telefono: this.clienteTelefono.trim()
        }
      );

      this.isLoading = false;

      // ── REDIRECCIÓN COMPLETA AL RESUMEN UNIFICADO ──
      this.router.navigate(['/resumen-cotizacion', cotizacion.id]);
    }, 1000);
  }
}