import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, flameOutline, cartOutline, starOutline,
  pricetagOutline, trendingUpOutline
} from 'ionicons/icons';
import { ProductosService, Producto } from '../../../services/productos.service';
import { Carrito } from '../../../services/carrito';

interface ProductoOferta extends Producto {
  descuento: number;     // Porcentaje de descuento
  precioOriginal: number;
  badge: string;         // 'MÁS VENDIDO' | 'OFERTA' | 'NUEVO'
}

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, DecimalPipe,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton, IonIcon
  ]
})
export class OfertasPage implements OnInit {
  private productosService = inject(ProductosService);
  private carritoService   = inject(Carrito);
  private toastCtrl        = inject(ToastController);

  ofertas: ProductoOferta[] = [];

  constructor() {
    addIcons({
      arrowBackOutline, flameOutline, cartOutline, starOutline,
      pricetagOutline, trendingUpOutline
    });
  }

  ngOnInit() {
    this.generarOfertas();
  }

  // Simula ofertas usando los productos existentes con descuentos aleatorios
  private generarOfertas() {
    const todos = this.productosService.getAll();
    const idsOfertas = ['3', '5', '7', '12', '16', '20'];
    const seleccionados = todos.filter(p => idsOfertas.includes(p.id));
    const badges = ['🔥 MÁS VENDIDO', '⭐ OFERTA SUPERIOR', '⚡ OUTLET', '🏷️ RECOMENDADO'];

    this.ofertas = seleccionados.map((p, i) => {
      const descuento = [15, 20, 10, 25, 12, 18][i % 6];
      return {
        ...p,
        descuento,
        precioOriginal: p.precio,
        precio: Math.round(p.precio * (1 - descuento / 100) * 100) / 100,
        badge: badges[i % badges.length]
      };
    });
  }

  async agregarAlCarrito(oferta: ProductoOferta) {
    this.carritoService.agregarProducto({
      id:     oferta.id,
      nombre: oferta.nombre,
      precio: oferta.precio,
      imagen: oferta.imagen
    });

    const toast = await this.toastCtrl.create({
      message: `✅ ${oferta.nombre} añadido al carrito`,
      duration: 1500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}
