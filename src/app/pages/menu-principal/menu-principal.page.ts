import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonIcon, AlertController, ToastController, IonButtons, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  cubeOutline, documentTextOutline, timeOutline,
  peopleOutline, logOutOutline, chevronForwardOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.page.html',
  styleUrls: ['./menu-principal.page.scss'],
  standalone: true,
  imports: [IonButton, IonButtons,  
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon
  ]
})
export class MenuPrincipalPage {

  nombreUsuario: string = 'Usuario';
  rolUsuario: string = '';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({personCircleOutline,cubeOutline,chevronForwardOutline,documentTextOutline,timeOutline,peopleOutline,logOutOutline});
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
  }

  esAdmin(): boolean {
    return this.rolUsuario === 'admin';
  }

  // ── REDIRECCIÓN HACIA LAS RUTAS PLANAS ──
  // Nota: Ya no usamos /trabajador/ o /cliente/ en las rutas
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
            localStorage.clear(); // Limpiamos todo el almacenamiento
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }
}