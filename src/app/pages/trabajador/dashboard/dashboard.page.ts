import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonIcon, IonButtons, IonBackButton,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, analyticsOutline, documentTextOutline,
  checkmarkCircleOutline, timeOutline, alertCircleOutline,
  closeCircleOutline, cashOutline, syncOutline,
  chatboxEllipsesOutline, personOutline, callOutline
} from 'ionicons/icons';

import { CotizacionService } from '../../../services/cotizacion.service';
import { Cotizacion, EstadoCotizacion } from '../../../models/cotizacion.model';
import { SolicitudService } from '../../../services/solicitud.service';
import { Solicitud, EstadoSolicitud } from '../../../models/solicitud.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, DecimalPipe,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonIcon, IonButtons, IonBackButton
  ]
})
export class DashboardPage implements OnInit {

  // Servicios
  private cotizacionService = inject(CotizacionService);
  private solicitudService  = inject(SolicitudService);
  private router            = inject(Router);
  private toastCtrl         = inject(ToastController);

  // Estado
  cotizaciones: Cotizacion[] = [];
  solicitudes: Solicitud[]   = [];
  
  // Métricas
  totalCotizaciones = 0;
  montoAceptado     = 0;
  montoPendiente    = 0;
  totalSolicitudes  = 0;
  solicitudesNuevas = 0;

  constructor() {
    addIcons({
      arrowBackOutline, analyticsOutline, documentTextOutline,
      checkmarkCircleOutline, timeOutline, alertCircleOutline,
      closeCircleOutline, cashOutline, syncOutline,
      chatboxEllipsesOutline, personOutline, callOutline
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    // Seguridad: verificar que sea un empleado
    const rol = localStorage.getItem('ksk_rol');
    if (rol !== 'empleado') {
      this.router.navigate(['/menu'], { replaceUrl: true });
      return;
    }
    this.cargarDatos();
  }

  cargarDatos() {
    const raw = this.cotizacionService.getAll();
    this.cotizaciones = Array.isArray(raw) ? raw : [];
    this.solicitudes = this.solicitudService.getAll();
    this.calcularMetricas();
  }

  private calcularMetricas() {
    this.totalCotizaciones = this.cotizaciones.length;
    
    this.montoAceptado = this.cotizaciones
      .filter(c => c.estado === 'Aceptada')
      .reduce((acc, c) => acc + c.total, 0);

    this.montoPendiente = this.cotizaciones
      .filter(c => c.estado === 'Pendiente')
      .reduce((acc, c) => acc + c.total, 0);

    this.totalSolicitudes = this.solicitudes.length;
    this.solicitudesNuevas = this.solicitudes.filter(s => s.estado === 'Nueva').length;
  }

  async cambiarEstadoCotizacion(id: string, event: Event) {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select.value as EstadoCotizacion;

    if (nuevoEstado) {
      this.cotizacionService.cambiarEstado(id, nuevoEstado);
      this.cargarDatos();

      const toast = await this.toastCtrl.create({
        message: `Estado de ${id} cambiado a ${nuevoEstado}`,
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  async cambiarEstadoSolicitud(id: string, event: Event) {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select.value as EstadoSolicitud;

    if (nuevoEstado) {
      this.solicitudService.cambiarEstado(id, nuevoEstado);
      this.cargarDatos();

      const toast = await this.toastCtrl.create({
        message: `Solicitud ${id} → ${nuevoEstado}`,
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  getEstadoClass(estado: EstadoCotizacion): string {
    return `estado-${estado.toLowerCase()}`;
  }

  getEstadoSolicitudClass(estado: EstadoSolicitud): string {
    const map: Record<string, string> = {
      'Nueva': 'estado-nueva',
      'En revisión': 'estado-revision',
      'Respondida': 'estado-respondida'
    };
    return map[estado] || 'estado-nueva';
  }

  verResumen(id: string) {
    this.router.navigate(['/resumen-cotizacion', id]);
  }
}
