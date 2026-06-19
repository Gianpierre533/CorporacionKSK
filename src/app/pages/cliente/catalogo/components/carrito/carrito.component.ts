import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonFooter, 
  IonIcon, IonButton, IonList, ModalController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, trashOutline, addOutline, removeOutline, cartOutline, cashOutline } from 'ionicons/icons';
import { Carrito } from '../../../../../services/carrito';
import { CheckoutPage } from '../../../checkout/checkout.page';

@Component({
  selector: 'app-carrito-modal',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true,
  imports: [
    CommonModule, DecimalPipe, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonContent, IonFooter, IonIcon, IonButton, IonList
  ]
})
export class CarritoComponent {
  public carritoService = inject(Carrito);
  private modalCtrl     = inject(ModalController);

  constructor() {
    addIcons({ closeOutline, cartOutline, removeOutline, addOutline, trashOutline, cashOutline });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async procesarCompra() {
    this.modalCtrl.dismiss(); // Cierra el carrito
    
    // Abre directamente la flamante página de checkout que diseñamos antes
    const modal = await this.modalCtrl.create({
      component: CheckoutPage,
      cssClass: 'full-screen-modal',
      backdropDismiss: false
    });
    
    return await modal.present();
  }
}