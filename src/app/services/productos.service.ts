// ============================================================
//  PRODUCTOS SERVICE
//  Centraliza los datos del catálogo de productos.
//  Cuando integremos Firebase, solo este archivo cambia.
// ============================================================

import { Injectable } from '@angular/core';

// ── Interfaz del producto ──────────────────────────────────
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'  // disponible en toda la app sin importar en módulos
})
export class ProductosService {

  private productos: Producto[] = [
    {
      id: '1',
      nombre: 'Bomba de Agua 1HP',
      descripcion: 'Bomba centrífuga de alto rendimiento para uso industrial.',
      precio: 375.00, stock: 15, categoria: 'mecanico',
      imagen: '/assets/Productos/bomba-agua.jpg'
    },
    {
      id: '2',
      nombre: 'Cable Eléctrico 2.5mm',
      descripcion: 'Cable eléctrico flexible antillama 2.5mm x 100m.',
      precio: 180.00, stock: 42, categoria: 'electrico',
      imagen: '/assets/Productos/cable-electrico.jpg'
    },
    {
      id: '3',
      nombre: 'Interruptor Termomagnético',
      descripcion: 'Interruptor termomagnético de 2 polos 20A.',
      precio: 40.00, stock: 8, categoria: 'electrico',
      imagen: '/assets/Productos/interruptor.jpg'
    },
    {
      id: '4',
      nombre: 'Reflector LED 100W',
      descripcion: 'Reflector LED de alta potencia para exteriores.',
      precio: 76.00, stock: 20, categoria: 'iluminacion',
      imagen: '/assets/Productos/reflector.jpg'
    },
    {
      id: '5',
      nombre: 'Llave Ajustable 12"',
      descripcion: 'Llave ajustable de acero forjado resistente.',
      precio: 35.00, stock: 5, categoria: 'herramientas',
      imagen: '/assets/Productos/llave.jpg'
    },
    {
      id: '6',
      nombre: 'Tubería PVC 4"',
      descripcion: 'Tubería PVC de 4 pulgadas para instalaciones.',
      precio: 28.00, stock: 60, categoria: 'mecanico',
      imagen: '/assets/Productos/tuberia.png'
    },
  ];

  // ── MÉTODOS PROTEGIDOS PARA EVITAR EL ERROR t16.sort ──

  getAll(): Producto[] {
    // Patrón de seguridad: Retornamos una copia ordenada de forma segura
    if (Array.isArray(this.productos)) {
      return [...this.productos].sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    return [];
  }

  getById(id: string): Producto | undefined {
    return this.productos.find(p => p.id === id);
  }

  getPorCategoria(categoria: string): Producto[] {
    if (categoria === 'todos') return this.getAll();
    const filtrados = this.productos.filter(p => p.categoria === categoria);
    return Array.isArray(filtrados) ? filtrados : [];
  }

  buscar(query: string): Producto[] {
    const q = query.toLowerCase();
    const resultados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q)
    );
    return Array.isArray(resultados) ? resultados : [];
  }
}