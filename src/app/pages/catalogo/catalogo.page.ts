import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  searchOutline, closeOutline, cubeOutline,
  flashOutline, cogOutline, buildOutline,
  chevronForwardOutline, arrowBackOutline
} from 'ionicons/icons';

// ── Interfaz del producto ──────────────────────────────────
// Define la estructura de cada producto del catálogo.
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  icono: string;
}

// ── Interfaz de categoría ──────────────────────────────────
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
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonIcon, IonButtons, IonBackButton
  ]
})
export class CatalogoPage implements OnInit {

  mostrarBusqueda = false;
  searchQuery = '';
  categoriaActiva = 'todos';

  categorias: Categoria[] = [
    { key: 'todos',       label: 'Todos' },
    { key: 'electrico',   label: 'Eléctrico' },
    { key: 'mecanico',    label: 'Mecánico' },
    { key: 'herramientas',label: 'Herramientas' },
    { key: 'iluminacion', label: 'Iluminación' },
  ];

  // ── Productos de ejemplo ─────────────────────────────────
  // Cuando tengas una API real, estos datos vendrán del backend.
  // Por ahora los hardcodeamos para mostrar el diseño funcional.
  productos: Producto[] = [
    { id: '1', nombre: 'Bomba de Agua 1HP',         descripcion: 'Bomba centrífuga de alto rendimiento para uso industrial.', precio: 350.00, stock: 15, categoria: 'mecanico',     icono: 'cog-outline' },
    { id: '2', nombre: 'Cable Eléctrico 2.5mm',     descripcion: 'Cable eléctrico flexible antillama 2.5mm x 100m.',          precio: 120.00, stock: 42, categoria: 'electrico',    icono: 'flash-outline' },
    { id: '3', nombre: 'Interruptor Termomagnético', descripcion: 'Interruptor termomagnético de 2 polos 20A.',                precio:  45.00, stock:  8, categoria: 'electrico',    icono: 'flash-outline' },
    { id: '4', nombre: 'Reflector LED 100W',         descripcion: 'Reflector LED de alta potencia para exteriores.',           precio:  80.00, stock: 20, categoria: 'iluminacion',  icono: 'flash-outline' },
    { id: '5', nombre: 'Llave Ajustable 12"',        descripcion: 'Llave ajustable de acero forjado resistente.',              precio:  35.00, stock:  5, categoria: 'herramientas', icono: 'build-outline' },
    { id: '6', nombre: 'Tubería PVC 4"',             descripcion: 'Tubería PVC de 4 pulgadas para instalaciones.',             precio:  28.00, stock: 60, categoria: 'mecanico',     icono: 'cube-outline' },
  ];

  productosFiltrados: Producto[] = [];

  constructor(private router: Router) {
    addIcons({
      searchOutline, closeOutline, cubeOutline,
      flashOutline, cogOutline, buildOutline,
      chevronForwardOutline, arrowBackOutline
    });
  }

  ngOnInit() {
    this.productosFiltrados = [...this.productos];
  }

  // Muestra u oculta la barra de búsqueda
  toggleBusqueda() {
    this.mostrarBusqueda = !this.mostrarBusqueda;
    if (!this.mostrarBusqueda) this.clearSearch();
  }

  // Filtra productos por texto ingresado
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target?.value ?? '';
    this.aplicarFiltros();
  }

  clearSearch() {
    this.searchQuery = '';
    this.aplicarFiltros();
  }

  // Filtra por categoría al tocar un chip
  filtrarCategoria(key: string) {
    this.categoriaActiva = key;
    this.aplicarFiltros();
  }

  // Aplica búsqueda + categoría al mismo tiempo
  private aplicarFiltros() {
    let resultado = [...this.productos];

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

  // Navega al detalle del producto (próximamente)
  verDetalle(producto: Producto) {
    // this.router.navigate(['/catalogo', producto.id]);
    console.log('Ver producto:', producto.nombre);
  }
}