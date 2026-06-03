import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButtons, IonBackButton, IonSpinner,
  IonModal, IonButton,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  cubeOutline, trashOutline, addOutline, removeOutline,
  addCircleOutline, documentTextOutline, personOutline,
  callOutline, arrowBackOutline
} from 'ionicons/icons';

import { CotizacionService } from '../../services/cotizacion.service';
import { ItemCotizacion } from '../../models/cotizacion.model';

// Producto del catálogo (simplificado para la cotización)
interface ProductoCatalogo {
  id: string;
  nombre: string;
  precio: number;
}

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
export class GenerarCotizacionPage {

  // ── Estado del formulario ──────────────────────────────
  itemsSeleccionados: ItemCotizacion[] = [];
  clienteNombre   = '';
  clienteTelefono = '';
  isLoading       = false;
  modalCatalogoAbierto = false;

  // ── Totales calculados ─────────────────────────────────
  subtotal = 0;
  igv      = 0;
  total    = 0;

  // ── Catálogo de productos disponibles ─────────────────
  // Cuando tengas una API estos vendrán del backend.
  // Por ahora son los mismos del catálogo hardcodeado.
  catalogoProductos: ProductoCatalogo[] = [
    { id: '1', nombre: 'Bomba de Agua 1HP',          precio: 350.00 },
    { id: '2', nombre: 'Cable Eléctrico 2.5mm',      precio: 120.00 },
    { id: '3', nombre: 'Interruptor Termomagnético',  precio:  45.00 },
    { id: '4', nombre: 'Reflector LED 100W',          precio:  80.00 },
    { id: '5', nombre: 'Llave Ajustable 12"',         precio:  35.00 },
    { id: '6', nombre: 'Tubería PVC 4"',              precio:  28.00 },
  ];

  constructor(
    private cotizacionService: CotizacionService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({
      cubeOutline, trashOutline, addOutline, removeOutline,
      addCircleOutline, documentTextOutline, personOutline,
      callOutline, arrowBackOutline
    });
  }

  // ── Modal catálogo ─────────────────────────────────────
  abrirCatalogo()  { this.modalCatalogoAbierto = true;  }
  cerrarCatalogo() { this.modalCatalogoAbierto = false; }

  // ── Agregar producto desde el modal ───────────────────
  agregarProducto(p: ProductoCatalogo) {
    const existe = this.itemsSeleccionados.find(i => i.id === p.id);

    if (existe) {
      // Si ya está, solo incrementa la cantidad
      this.incrementar(existe);
    } else {
      this.itemsSeleccionados.push({
        id:       p.id,
        nombre:   p.nombre,
        precio:   p.precio,
        cantidad: 1,
        subtotal: p.precio
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

      // Navega al resumen pasando el ID de la cotización creada
      this.router.navigate(['/cotizacion/resumen', cotizacion.id]);
    }, 1000);
  }
}