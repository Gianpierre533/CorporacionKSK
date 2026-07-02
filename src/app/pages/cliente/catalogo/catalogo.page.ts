import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButtons, IonBackButton, ModalController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  searchOutline, closeOutline, chevronForwardOutline, arrowBackOutline, cubeOutline, cartOutline
} from 'ionicons/icons';

import { ProductosService, Producto } from '../../../services/productos.service';
import { Carrito } from '../../../services/carrito';

interface Categoria {
  key: string;
  label: string;
}

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    DecimalPipe,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonIcon, 
    IonButtons, 
    IonBackButton
  ]
})
export class CatalogoPage implements OnInit {

  mostrarBusqueda = false;
  searchQuery     = '';
  categoriaActiva = 'todos';

  categorias: Categoria[] = [
    { key: 'todos',        label: 'Todos'        },
    { key: 'cocina',       label: 'Cocina'       },
    { key: 'hogar',        label: 'Hogar'        },
    { key: 'belleza',      label: 'Belleza'      },
    { key: 'accesorios',   label: 'Accesorios'   },
  ];

  productosFiltrados: Producto[] = [];

  public router           = inject(Router);
  private productosService = inject(ProductosService);
  public carritoService    = inject(Carrito);
  private modalCtrl        = inject(ModalController);

  constructor() {
    addIcons({ searchOutline, closeOutline, cubeOutline, chevronForwardOutline, arrowBackOutline, cartOutline });
  }

  ngOnInit() {
    this.productosFiltrados = this.productosService.getAll();
  }

  // 🔥 SOLUCIÓN DEFINITIVA: Lazy loading del componente para evitar errores de compilación
  async abrirCarrito() {
    // Importamos dinámicamente el componente aquí mismo
    const { CarritoComponent } = await import('./components/carrito/carrito.component');
    
    const modal = await this.modalCtrl.create({
      component: CarritoComponent
    });
    return await modal.present();
  }

  // ... resto de tus métodos (toggleBusqueda, agregarAlCarrito, etc.) se mantienen igual
  toggleBusqueda() {
    this.mostrarBusqueda = !this.mostrarBusqueda;
    if (!this.mostrarBusqueda) this.clearSearch();
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target?.value ?? '';
    this.aplicarFiltros();
  }

  clearSearch() {
    this.searchQuery = '';
    this.aplicarFiltros();
  }

  filtrarCategoria(key: string) {
    this.categoriaActiva = key;
    this.aplicarFiltros();
  }

  agregarAlCarrito(event: Event, producto: Producto) {
    event.stopPropagation(); 
    this.carritoService.agregarProducto({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      codigo: (producto as any).codigo || ''
    });
  }

  private aplicarFiltros() {
    let resultado = this.productosService.getAll();
    if (this.categoriaActiva !== 'todos') {
      resultado = resultado.filter(p => p.categoria === this.categoriaActiva);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      );
    }
    this.productosFiltrados = resultado;
  }

  verDetalle(producto: Producto) {
    console.log('Ver producto:', producto.nombre);
  }
}