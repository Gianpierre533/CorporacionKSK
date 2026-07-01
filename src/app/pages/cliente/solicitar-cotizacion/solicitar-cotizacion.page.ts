import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, createOutline, callOutline, personOutline,
  chatboxEllipsesOutline, checkmarkCircleOutline, sendOutline
} from 'ionicons/icons';
import { SolicitudService } from '../../../services/solicitud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitar-cotizacion',
  templateUrl: './solicitar-cotizacion.page.html',
  styleUrls: ['./solicitar-cotizacion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton, IonIcon
  ]
})
export class SolicitarCotizacionPage {
  private solicitudService = inject(SolicitudService);
  private toastCtrl        = inject(ToastController);
  private router           = inject(Router);

  nombre      = '';
  telefono    = '';
  descripcion = '';
  enviando    = false;
  enviado     = false;

  constructor() {
    addIcons({
      arrowBackOutline, createOutline, callOutline, personOutline,
      chatboxEllipsesOutline, checkmarkCircleOutline, sendOutline
    });
  }

  formularioValido(): boolean {
    return this.nombre.trim().length >= 2
        && this.telefono.trim().length >= 7
        && this.descripcion.trim().length >= 10;
  }

  async enviarSolicitud() {
    if (!this.formularioValido() || this.enviando) return;
    this.enviando = true;

    // Pequeño delay para dar sensación de procesamiento
    await new Promise(r => setTimeout(r, 800));

    this.solicitudService.crear({
      clienteNombre:    this.nombre.trim(),
      clienteTelefono:  this.telefono.trim(),
      descripcion:      this.descripcion.trim()
    });

    this.enviando = false;
    this.enviado  = true;

    // Limpiar form
    this.nombre = '';
    this.telefono = '';
    this.descripcion = '';

    const toast = await this.toastCtrl.create({
      message: '✅ ¡Solicitud enviada! Un asesor te contactará pronto.',
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  nuevaSolicitud() {
    this.enviado = false;
  }

  volverAlMenu() {
    this.router.navigate(['/menu'], { replaceUrl: true });
  }
}
