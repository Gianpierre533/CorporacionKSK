import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  searchOutline, closeOutline, chevronForwardOutline, arrowBackOutline, cubeOutline } from 'ionicons/icons';

// Importamos el servicio y la interfaz desde un solo lugar
import { ProductosService, Producto } from '../../services/productos.service';

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
    CommonModule, DecimalPipe,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonIcon, IonButtons, IonBackButton
  ]
})
export class CatalogoPage implements OnInit {

  mostrarBusqueda = false;
  searchQuery     = '';
  categoriaActiva = 'todos';

  categorias: Categoria[] = [
    { key: 'todos',        label: 'Todos'        },
    { key: 'electrico',    label: 'Eléctrico'    },
    { key: 'mecanico',     label: 'Mecánico'     },
    { key: 'herramientas', label: 'Herramientas' },
    { key: 'iluminacion',  label: 'Iluminación'  },
  ];

  productosFiltrados: Producto[] = [];

  private router           = inject(Router);
  private productosService = inject(ProductosService);

  constructor() {
    addIcons({searchOutline,closeOutline,cubeOutline,chevronForwardOutline,arrowBackOutline});
  }

  ngOnInit() {
    // Cargamos todos los productos desde el servicio
    this.productosFiltrados = this.productosService.getAll();
  }

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

  // Aplica búsqueda + categoría delegando al servicio
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