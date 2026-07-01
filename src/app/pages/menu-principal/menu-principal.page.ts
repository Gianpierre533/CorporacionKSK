import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonIcon, AlertController, ToastController, IonButtons, IonButton,
  IonBadge, IonModal } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  cubeOutline, documentTextOutline, timeOutline,
  logOutOutline, chevronForwardOutline, personCircleOutline,
  analyticsOutline, bagCheckOutline, chatboxEllipsesOutline,
  callOutline, pricetagsOutline, flameOutline,
  notificationsOutline, checkmarkDoneOutline, trashOutline, closeOutline
} from 'ionicons/icons';
import { NotificacionService } from '../../services/notificacion.service';
import { Notificacion } from '../../models/notificacion.model';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.page.html',
  styleUrls: ['./menu-principal.page.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonBadge, IonModal,
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon
  ]
})
export class MenuPrincipalPage {
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);
  private notifService = inject(NotificacionService);

  nombreUsuario: string = 'Usuario';
  rolUsuario: string = '';

  // Notificaciones
  notificaciones: Notificacion[] = [];
  noLeidasCount = 0;
  mostrarNotificaciones = false;

  constructor() {
    addIcons({
      personCircleOutline,
      cubeOutline,
      chevronForwardOutline,
      documentTextOutline,
      timeOutline,
      logOutOutline,
      analyticsOutline,
      bagCheckOutline,
      chatboxEllipsesOutline,
      callOutline,
      pricetagsOutline,
      flameOutline,
      notificationsOutline,
      checkmarkDoneOutline,
      trashOutline,
      closeOutline
    });
  }

  ionViewWillEnter() {
    // Seguridad: Si no hay usuario ni rol, enviamos al login inmediatamente
    const usuario = localStorage.getItem('ksk_usuario');
    const rol = localStorage.getItem('ksk_rol');

    if (!usuario || !rol) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.nombreUsuario = usuario;
    this.rolUsuario = rol;

    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    if (this.rolUsuario) {
      this.notificaciones = this.notifService.getPorRol(this.rolUsuario as any);
      this.noLeidasCount = this.notifService.contarNoLeidas(this.rolUsuario as any);
    }
  }

  abrirNotificaciones() {
    this.mostrarNotificaciones = true;
    this.cargarNotificaciones();
  }

  cerrarNotificaciones() {
    this.mostrarNotificaciones = false;
  }

  marcarComoLeida(notif: Notificacion) {
    this.notifService.marcarComoLeida(notif.id);
    this.cargarNotificaciones();
  }

  marcarTodasComoLeidas() {
    this.notifService.marcarTodasComoLeidas(this.rolUsuario as any);
    this.cargarNotificaciones();
  }

  eliminarNotificacion(id: string) {
    this.notifService.eliminar(id);
    this.cargarNotificaciones();
  }

  async limpiarTodas() {
    const alert = await this.alertCtrl.create({
      header: 'Limpiar notificaciones',
      message: '¿Deseas eliminar todas las notificaciones?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.notifService.eliminarTodas(this.rolUsuario as any);
            this.cargarNotificaciones();
          }
        }
      ]
    });
    await alert.present();
  }

  handleNotifClick(notif: Notificacion) {
    this.marcarComoLeida(notif);
    this.mostrarNotificaciones = false;

    if (notif.destinatarioRol === 'empleado' && notif.tipo === 'solicitud') {
      this.router.navigate(['/dashboard']);
    }
  }

  esEmpleado(): boolean {
    return this.rolUsuario === 'empleado';
  }

  esCliente(): boolean {
    return this.rolUsuario === 'cliente';
  }

  // ── REDIRECCIÓN HACIA LAS RUTAS PLANAS ──
  irA(ruta: string) {
    this.router.navigate([ruta]);
  }

  async cerrarSesion() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que deseas salir de la aplicación?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          role: 'destructive',
          handler: () => {
            // Limpieza selectiva: se borra la sesión y el carrito pero NO la base de datos de cotizaciones
            localStorage.removeItem('ksk_usuario');
            localStorage.removeItem('ksk_rol');
            localStorage.removeItem('ksk_carrito');
            
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }
}