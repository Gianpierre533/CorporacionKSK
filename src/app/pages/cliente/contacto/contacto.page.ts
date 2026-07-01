import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonBackButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, logoWhatsapp, callOutline, locationOutline,
  timeOutline, mailOutline, chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton, IonIcon
  ]
})
export class ContactoPage {
  constructor() {
    addIcons({
      arrowBackOutline, logoWhatsapp, callOutline, locationOutline,
      timeOutline, mailOutline, chevronForwardOutline
    });
  }

  abrirWhatsApp() {
    window.open('https://wa.me/51906623145?text=Hola%20KSK%2C%20quisiera%20hacer%20una%20consulta', '_blank');
  }

  llamar() {
    window.open('tel:+51906623145');
  }

  abrirMapa() {
    window.open('https://maps.app.goo.gl/DLHRgKPaEXeoPstd6', '_blank');
  }
}
