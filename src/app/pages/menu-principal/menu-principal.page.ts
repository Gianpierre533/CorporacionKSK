import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, AlertController, ToastController, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  cubeOutline, documentTextOutline, timeOutline,
  peopleOutline, logOutOutline, chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.page.html',
  styleUrls: ['./menu-principal.page.scss'],
  standalone: true,
  imports: [ 
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonIcon
  ]
})
export class MenuPrincipalPage {

  nombreUsuario: string = 'Usuario';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      cubeOutline, documentTextOutline, timeOutline,
      peopleOutline, logOutOutline, chevronForwardOutline
    });
  }

  ionViewWillEnter() {
    const nombre = localStorage.getItem('ksk_usuario');
    this.nombreUsuario = nombre ?? 'Usuario';
  }

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
            localStorage.removeItem('ksk_usuario');
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }
}