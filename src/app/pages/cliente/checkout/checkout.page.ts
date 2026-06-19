import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common'; // <-- Añadido DecimalPipe explícito
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
  IonList, IonItem, IonLabel, IonNote, IonGrid, IonRow, IonCol, IonIcon, 
  IonButton, IonFooter 
} from '@ionic/angular/standalone';
import { Carrito } from '../../../services/carrito';
import { addIcons } from 'ionicons';
import { 
  cardOutline, phonePortraitOutline, businessOutline, arrowBackOutline, 
  receiptOutline, lockClosedOutline, checkmarkCircle 
} from 'ionicons/icons';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DecimalPipe, // <-- Declarado aquí para el compilador estricto
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
    IonList, IonItem, IonLabel, IonNote, IonGrid, IonRow, IonCol, IonIcon, 
    IonButton, IonFooter
  ]
})
export class CheckoutPage {
  public carritoService = inject(Carrito);
  public metodoSeleccionado: string = 'card'; 

  constructor() {
    addIcons({ 
      cardOutline, phonePortraitOutline, businessOutline, 
      arrowBackOutline, receiptOutline, lockClosedOutline, checkmarkCircle 
    });
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }

  confirmarPago() {
    alert('¡Pedido procesado con éxito en KSK Importaciones!');
  }
}