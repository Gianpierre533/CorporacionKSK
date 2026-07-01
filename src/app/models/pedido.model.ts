// ============================================================
//  PEDIDO MODEL
//  Representa una compra completada por el cliente.
//  Se persiste en localStorage bajo la clave 'ksk_pedidos'.
// ============================================================

export interface ItemPedido {
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  imagen?: string;
}

export interface Pedido {
  id: string;
  fecha: string;      // ISO 8601
  items: ItemPedido[];
  total: number;
  metodoPago: string; // 'Tarjeta' | 'Yape/Plin' | 'Pago en Tienda'
}
