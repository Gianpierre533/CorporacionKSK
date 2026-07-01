import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, bagCheckOutline, receiptOutline, calendarOutline,
  chevronDownOutline, chevronUpOutline, cartOutline, pricetagOutline
} from 'ionicons/icons';
import { Pedido } from '../../../models/pedido.model';

@Component({
  selector: 'app-mis-compras',
  templateUrl: './mis-compras.page.html',
  styleUrls: ['./mis-compras.page.scss'],
  standalone: true,
  imports: [
    CommonModule, DecimalPipe,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton, IonIcon
  ]
})
export class MisComprasPage implements OnInit {
  pedidos: Pedido[] = [];
  expandidos: Set<string> = new Set();

  totalGastado = 0;
  totalPedidos = 0;

  constructor() {
    addIcons({
      arrowBackOutline, bagCheckOutline, receiptOutline, calendarOutline,
      chevronDownOutline, chevronUpOutline, cartOutline, pricetagOutline
    });
  }

  ngOnInit() { this.cargarPedidos(); }
  ionViewWillEnter() { this.cargarPedidos(); }

  cargarPedidos() {
    try {
      const raw = localStorage.getItem('ksk_pedidos');
      const lista: Pedido[] = raw ? JSON.parse(raw) : [];
      this.pedidos = Array.isArray(lista)
        ? [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha))
        : [];
      this.totalPedidos = this.pedidos.length;
      this.totalGastado = this.pedidos.reduce((acc, p) => acc + p.total, 0);
    } catch {
      this.pedidos = [];
    }
  }

  toggleExpand(id: string) {
    if (this.expandidos.has(id)) {
      this.expandidos.delete(id);
    } else {
      this.expandidos.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandidos.has(id);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('es-PE', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  getMetodoBadge(metodo: string): string {
    const map: Record<string, string> = {
      'Tarjeta': 'badge badge--card',
      'Yape/Plin': 'badge badge--yape',
      'Pago en Tienda': 'badge badge--tienda'
    };
    return map[metodo] || 'badge badge--card';
  }
}
