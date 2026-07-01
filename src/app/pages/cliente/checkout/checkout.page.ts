import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
  IonList, IonItem, IonLabel, IonNote, IonGrid, IonRow, IonCol, IonIcon, 
  ToastController 
} from '@ionic/angular/standalone';
import { Carrito } from '../../../services/carrito';
import { Pedido, ItemPedido } from '../../../models/pedido.model';
import { ProductosService } from '../../../services/productos.service';
import { addIcons } from 'ionicons';
import { 
  cardOutline, phonePortraitOutline, businessOutline, arrowBackOutline, 
  receiptOutline, lockClosedOutline, checkmarkCircle, copyOutline, qrCodeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DecimalPipe,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
    IonList, IonItem, IonLabel, IonNote, IonGrid, IonRow, IonCol, IonIcon
  ]
})
export class CheckoutPage {
  public carritoService   = inject(Carrito);
  private router           = inject(Router);
  private toastCtrl        = inject(ToastController);
  private productosService = inject(ProductosService);
  
  public metodoSeleccionado: string = 'card'; 

  // Tarjeta
  cardNombre = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';

  constructor() {
    addIcons({ 
      cardOutline, phonePortraitOutline, businessOutline, 
      arrowBackOutline, receiptOutline, lockClosedOutline, checkmarkCircle,
      copyOutline, qrCodeOutline
    });
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }

  // Formateadores
  formatCardNumber(event: any) {
    const value = event.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }
    this.cardNumber = formatted;
  }

  formatCardExpiry(event: any) {
    const value = event.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      this.cardExpiry = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      this.cardExpiry = value;
    }
  }

  formatCVV(event: any) {
    this.cardCvv = event.target.value.replace(/\D/g, '').substring(0, 3);
  }

  // Validación
  isFormValido(): boolean {
    if (this.metodoSeleccionado === 'card') {
      return this.cardNombre.trim().length > 3 && 
             this.cardNumber.replace(/\s/g, '').length === 16 && 
             this.cardExpiry.length === 5 && 
             this.cardCvv.length === 3;
    }
    // Yape y Banco no requieren campos, se confía en el pago directo
    return true;
  }

  getButtonLabel(): string {
    if (this.metodoSeleccionado === 'card') {
      return 'PAGAR CON TARJETA';
    }
    if (this.metodoSeleccionado === 'yape') {
      return 'CONFIRMAR PAGO - YA YAPEÉ/PLINEÉ';
    }
    if (this.metodoSeleccionado === 'transfer') {
      return 'CONFIRMAR TRANSFERENCIA';
    }
    return 'CONFIRMAR Y PAGAR AHORA';
  }

  private getMetodoLabel(): string {
    const map: Record<string, string> = {
      'card': 'Tarjeta de Crédito/Débito',
      'yape': 'Yape / Plin',
      'transfer': 'Transferencia Bancaria'
    };
    return map[this.metodoSeleccionado] || 'Tarjeta';
  }

  copiarTexto(texto: string, mensaje: string) {
    navigator.clipboard.writeText(texto);
    this.presentToast(`📋 ${mensaje} copiado al portapapeles`);
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      color: 'dark',
      position: 'bottom'
    });
    await toast.present();
  }

  async confirmarPago() {
    if (!this.isFormValido()) return;

    // Disminuir stock de los productos comprados
    this.carritoService.items().forEach(item => {
      this.productosService.disminuirStock(item.id, item.cantidad);
    });

    // Guardar el pedido en localStorage para el historial de "Mis Compras"
    const items: ItemPedido[] = this.carritoService.items().map(item => ({
      nombre:   item.nombre,
      cantidad: item.cantidad,
      precio:   item.precio,
      subtotal: item.precio * item.cantidad,
      imagen:   item.imagen
    }));

    const pedido: Pedido = {
      id:         'PED-' + Date.now(),
      fecha:      new Date().toISOString(),
      items,
      total:      this.carritoService.totalPagar(),
      metodoPago: this.getMetodoLabel()
    };

    // Leer pedidos existentes y agregar el nuevo
    try {
      const raw = localStorage.getItem('ksk_pedidos');
      const existentes: Pedido[] = raw ? JSON.parse(raw) : [];
      existentes.unshift(pedido);
      localStorage.setItem('ksk_pedidos', JSON.stringify(existentes));
    } catch {
      localStorage.setItem('ksk_pedidos', JSON.stringify([pedido]));
    }

    // Vaciar el carrito al terminar con éxito
    this.carritoService.vaciarCarrito();

    // Toast de éxito
    const toast = await this.toastCtrl.create({
      message: '✅ ¡Pedido procesado con éxito!',
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    // Redirigir al catálogo de productos de forma limpia
    this.router.navigate(['/catalogo'], { replaceUrl: true });
  }
}