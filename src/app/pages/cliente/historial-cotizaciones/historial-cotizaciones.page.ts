import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar,
  IonIcon, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  searchOutline, closeOutline, cubeOutline,
  documentTextOutline, arrowBackOutline
} from 'ionicons/icons';

import { CotizacionService } from '../../../services/cotizacion.service';
import { Cotizacion, EstadoCotizacion } from '../../../models/cotizacion.model';

@Component({
  selector: 'app-historial-cotizaciones',
  templateUrl: './historial-cotizaciones.page.html',
  styleUrls: ['./historial-cotizaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule, DecimalPipe,
    IonContent, IonHeader, IonToolbar,
    IonIcon, IonButtons, IonBackButton
  ]
})
export class HistorialCotizacionesPage {

  cotizaciones: Cotizacion[] = [];
  searchQuery  = '';
  filtroActivo = 'todos';

  filtros = [
    { key: 'todos',     label: 'Todos'     },
    { key: 'Pendiente', label: 'Pendiente' },
    { key: 'Enviada',   label: 'Enviada'   },
    { key: 'Aceptada',  label: 'Aceptada'  },
    { key: 'Rechazada', label: 'Rechazada' },
  ];

  constructor(
    private cotizacionService: CotizacionService,
    private router: Router
  ) {
    addIcons({
      searchOutline, closeOutline, cubeOutline,
      documentTextOutline, arrowBackOutline
    });
  }

  // Recargar cada vez que el usuario entra a esta página
  ionViewWillEnter() {
    this.aplicarFiltros();
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

  filtrarPor(key: string) {
    this.filtroActivo = key;
    this.aplicarFiltros();
  }

  // Aplica búsqueda + filtro de estado al mismo tiempo
  private aplicarFiltros() {
    let resultado = this.cotizacionService.getAll();

    if (this.filtroActivo !== 'todos') {
      resultado = resultado.filter(
        c => c.estado === this.filtroActivo as EstadoCotizacion
      );
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      resultado = resultado.filter(
        c =>
          c.id.toLowerCase().includes(q) ||
          c.cliente.nombre.toLowerCase().includes(q)
      );
    }

    this.cotizaciones = resultado;
  }

  verResumen(id: string) {
    this.router.navigate(['/cotizacion/resumen', id]);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  // Devuelve la clase CSS según el estado para el badge de color
  getEstadoClass(estado: EstadoCotizacion): string {
    return `estado-${estado.toLowerCase()}`;
  }
}