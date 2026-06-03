// ============================================================
//  MODELO: Cotización
//  Define la estructura completa de una cotización.
// ============================================================

// Cada producto dentro de una cotización
export interface ItemCotizacion {
  id: string;
  nombre: string;
  precio: number;      // precio unitario
  cantidad: number;
  subtotal: number;    // precio * cantidad
}

// Datos del cliente al que se le cotiza
export interface ClienteCotizacion {
  nombre: string;
  telefono: string;
}

// Estados posibles de una cotización
export type EstadoCotizacion = 'Pendiente' | 'Enviada' | 'Aceptada' | 'Rechazada';

// Cotización completa
export interface Cotizacion {
  id: string;                      // Ej: "COT-00025"
  numero: number;                  // Número correlativo
  fecha: string;                   // ISO string
  cliente: ClienteCotizacion;
  items: ItemCotizacion[];
  subtotal: number;                // Suma de todos los subtotales
  igv: number;                     // 18% del subtotal
  total: number;                   // subtotal + igv
  estado: EstadoCotizacion;
}