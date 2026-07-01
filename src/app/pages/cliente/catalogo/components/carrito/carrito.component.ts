import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonContent,
  IonIcon, IonButton, IonList, ModalController 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline, trashOutline, addOutline, removeOutline, cartOutline, cashOutline } from 'ionicons/icons';
import { Carrito } from '../../../../../services/carrito';

@Component({
  selector: 'app-carrito-modal',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true,
  imports: [
    CommonModule, DecimalPipe, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonContent, IonIcon, IonButton, IonList
  ]
})
export class CarritoComponent {
  public carritoService = inject(Carrito);
  private modalCtrl     = inject(ModalController);
  private router        = inject(Router);

  constructor() {
    addIcons({ closeOutline, cartOutline, removeOutline, addOutline, trashOutline, cashOutline });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async procesarCompra() {
    this.modalCtrl.dismiss(); // Cierra el modal del carrito
    this.router.navigate(['/checkout']); // Navega a la ruta plana del checkout
  }
}