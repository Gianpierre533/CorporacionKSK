// ============================================================
//  PÁGINA: MenuPrincipalPage
//
//  Es el "hub" de la aplicación: desde aquí el usuario navega
//  a todos los módulos. También maneja el cierre de sesión.
//
//  ionViewWillEnter: recarga el nombre del usuario cada vez
//  que se regresa a esta pantalla.
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonButtons, IonIcon,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  menuOutline, notificationsOutline, cubeOutline,
  documentTextOutline, timeOutline, peopleOutline,
  logOutOutline, chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.page.html',
  styleUrls: ['./menu-principal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonButtons, IonIcon
  ]
})
export class MenuPrincipalPage {

  // Nombre del usuario que se muestra en el saludo.
  // Por ahora lo tomamos de localStorage; más adelante
  // vendrá de un servicio de autenticación real.
  nombreUsuario: string = 'Usuario';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      menuOutline, notificationsOutline, cubeOutline,
      documentTextOutline, timeOutline, peopleOutline,
      logOutOutline, chevronForwardOutline
    });
  }

  // ionViewWillEnter se ejecuta cada vez que la página
  // se muestra, perfecto para refrescar datos del usuario.
  ionViewWillEnter() {
    // Leemos el nombre guardado en el login.
    // Si no hay nada, mostramos 'Usuario' por defecto.
    const nombre = localStorage.getItem('ksk_usuario');
    this.nombreUsuario = nombre ?? 'Usuario';
  }

  // ============================================================
  //  NAVEGACIÓN GENERAL
  //  Un solo método que recibe la ruta destino.
  //  Así no repetimos this.router.navigate() en cada tarjeta.
  // ============================================================
  irA(ruta: string) {
    this.router.navigate([ruta]);
  }

  // ============================================================
  //  ABRIR MENÚ LATERAL (por ahora muestra un toast informativo)
  //  Más adelante se conectará con ion-menu si se necesita.
  // ============================================================
  async abrirMenu() {
    const toast = await this.toastCtrl.create({
      message: 'Menú lateral próximamente',
      duration: 1500,
      position: 'bottom',
      color: 'medium'
    });
    await toast.present();
  }

  async verNotificaciones() {
    const toast = await this.toastCtrl.create({
      message: 'No tienes notificaciones nuevas',
      duration: 1500,
      position: 'bottom',
      color: 'medium'
    });
    await toast.present();
  }

  // ============================================================
  //  CERRAR SESIÓN con confirmación
  //  Limpia el localStorage y redirige al login.
  //  { replaceUrl: true } evita que el usuario regrese con
  //  el botón "atrás" del dispositivo.
  // ============================================================
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
            // Borramos los datos de sesión guardados
            localStorage.removeItem('ksk_usuario');
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }
}