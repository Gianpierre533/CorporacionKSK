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

const STORAGE_KEY = 'ksk_productos';

@Injectable({
  providedIn: 'root'  // disponible en toda la app sin importar en módulos
})
export class ProductosService {
  private productos: Producto[] = [];

  private iniciales: Producto[] = [
    {
      id: '1',
      nombre: 'Toallas para cabello',
      descripcion: 'Toalla de microfibra súper absorbente, ideal para secado rápido sin dañar el cabello.',
      precio: 8.00, stock: 35, categoria: 'hogar',
      imagen: 'assets/Productos/toallas-cabello.jpg'
    },
    {
      id: '2',
      nombre: 'Picatodo de verduras',
      descripcion: 'Cortador y picador manual con cuchilla de acero inoxidable, ideal para vegetales.',
      precio: 35.00, stock: 40, categoria: 'cocina',
      imagen: 'assets/Productos/picatodo-verduras.jpg'
    },
    {
      id: '3',
      nombre: 'Mini aspiradora inalámbrica',
      descripcion: 'Aspiradora de mano recargable USB para teclados y esquinas pequeñas.',
      precio: 19.00, stock: 15, categoria: 'hogar',
      imagen: 'assets/Productos/mini-aspiradora.jpg'
    },
    {
      id: '4',
      nombre: 'Pizarras acrílicas',
      descripcion: 'Pizarra blanca magnética con marco de aluminio, incluye borrador.',
      precio: 17.00, stock: 20, categoria: 'hogar',
      imagen: 'assets/Productos/pizarras-acrilicas.jpg'
    },
    {
      id: '5',
      nombre: 'Licuadora portátil',
      descripcion: 'Vaso licuador personal recargable USB con cuchillas de alta potencia.',
      precio: 31.00, stock: 25, categoria: 'cocina',
      imagen: 'assets/Productos/licuadora-portatil.jpg'
    },
    {
      id: '6',
      nombre: 'Set de jarra de vidrio con vasos',
      descripcion: 'Jarra de vidrio  de 1.5 litros con 6 vasos a juego de diseño premium.',
      precio: 20.00, stock: 18, categoria: 'cocina',
      imagen: 'assets/Productos/jarra-vidrio.jpg'
    },
    {
      id: '7',
      nombre: 'Masajeador 4D',
      descripcion: 'Masajeador de cuello y espalda',
      precio: 19.00, stock: 12, categoria: 'belleza',
      imagen: 'assets/Productos/masajeador-4d.jpg'
    },
    {
      id: '8',
      nombre: 'Máquina depiladora',
      descripcion: 'Depiladora corporal inalámbrica recargable, uso suave en zonas sensibles.',
      precio: 18.30, stock: 22, categoria: 'belleza',
      imagen: 'assets/Productos/maquina-depiladora.jpg'
    },
    {
      id: '9',
      nombre: 'Máquina de cortar cabello y barba',
      descripcion: 'Cortadora profesional de cabello y barba con peines reguladores y accesorios.',
      precio: 29.00, stock: 14, categoria: 'belleza',
      imagen: 'assets/Productos/maquina-cabello.jpg'
    },
    {
      id: '10',
      nombre: 'Plancha de cabello',
      descripcion: 'Alisadora con placas de cerámica de rápido calentamiento y control de temperatura.',
      precio: 27.00, stock: 16, categoria: 'belleza',
      imagen: 'assets/Productos/plancha-cabello.jpg'
    },
    {
      id: '11',
      nombre: 'Cartera x3 piezas',
      descripcion: 'Cartera elegante de cuero sintético con compartimentos interiores y correa ajustable.',
      precio: 42.00, stock: 10, categoria: 'accesorios',
      imagen: 'assets/Productos/cartera.jpg'
    },
    {
      id: '12',
      nombre: 'Hervidor Eléctrico',
      descripcion: 'Hervidor de agua de acero inoxidable de 500 ML con apagado automático de seguridad.',
      precio: 25.00, stock: 30, categoria: 'cocina',
      imagen: 'assets/Productos/hervidor-electrico.jpg'
    },
    {
      id: '13',
      nombre: 'Florero decorativo',
      descripcion: 'Florero de vidrio minimalista con relieve, perfecto para centro de mesa u oficina.',
      precio: 10.00, stock: 15, categoria: 'hogar',
      imagen: 'assets/Productos/florero.jpg'
    },
    {
      id: '14',
      nombre: 'Bolso de mano',
      descripcion: 'Bolso amplio de tela resistente con cierre y bolsillos organizadores.',
      precio: 33.00, stock: 12, categoria: 'accesorios',
      imagen: 'assets/Productos/bolso-mano.jpg'
    },
    {
      id: '15',
      nombre: 'Neceser maquillaje',
      descripcion: 'Neceser de maquillaje e higiene personal con múltiples compartimentos.',
      precio: 7.00, stock: 45, categoria: 'belleza',
      imagen: 'assets/Productos/neceser.jpg'
    },
    {
      id: '16',
      nombre: 'Foco Ventilador LED',
      descripcion: 'Foco inteligente con ventilador de techo integrado de 3 velocidades y control remoto.',
      precio: 53.00, stock: 8, categoria: 'hogar',
      imagen: 'assets/Productos/foco-ventilador.jpg'
    },
    {
      id: '17',
      nombre: 'Set de bowls',
      descripcion: 'Juego de 5 recipientes de acero inoxidable con tapas herméticas para conservación de alimentos.',
      precio: 68.50, stock: 25, categoria: 'cocina',
      imagen: 'assets/Productos/set-bowls.jpg'
    },
    {
      id: '18',
      nombre: 'Afilador de 3 segmentos',
      descripcion: 'Afilador manual de cuchillos de cocina con base antideslizante de tres etapas.',
      precio: 12.50, stock: 50, categoria: 'cocina',
      imagen: 'assets/Productos/afilador-segmentos.jpg'
    },
    {
      id: '19',
      nombre: 'Estantes para baños',
      descripcion: 'Organizador metálico antioxidante de baño con adhesivos de alta resistencia.',
      precio: 70.00, stock: 15, categoria: 'hogar',
      imagen: 'assets/Productos/estantes-banos.jpg'
    },
    {
      id: '20',
      nombre: 'Organizador de arroz y huevos',
      descripcion: 'Dispensador De Arroz y Menestras Con Organizador de Huevos ',
      precio: 110.00, stock: 10, categoria: 'cocina',
      imagen: 'assets/Productos/organizador-arroz.jpg'
    },
    {
      id: '21',
      nombre: 'Tomatodo 1L',
      descripcion: 'Botella de agua de un litro con marcador de tiempo y cañita de silicona libre de BPA.',
      precio: 12.50, stock: 40, categoria: 'hogar',
      imagen: 'assets/Productos/tomatodo-1l.jpg'
    }
  ];


  constructor() {
    this.cargarProductos();
  }

  private cargarProductos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const guardados: Producto[] = JSON.parse(raw);
        // Validar si la base de datos en código cambió (por precio del primer item o longitud)
        const itemUnoGuardado = guardados.find(p => p.id === '1');
        const itemUnoInicial  = this.iniciales.find(p => p.id === '1');
        
        if (
          guardados.length !== this.iniciales.length || 
          (itemUnoGuardado && itemUnoInicial && itemUnoGuardado.precio !== itemUnoInicial.precio)
        ) {
          // Si el código tiene precios/longitudes nuevas, actualizamos localStorage
          this.productos = [...this.iniciales];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.productos));
        } else {
          this.productos = guardados;
        }
      } else {
        this.productos = [...this.iniciales];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.productos));
      }
    } catch {
      this.productos = [...this.iniciales];
    }
  }

  private guardarProductos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.productos));
    } catch (e) {
      console.error('Error al guardar productos en localStorage', e);
    }
  }

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

  /**
   * Disminuye el stock de un producto cuando se concreta la compra.
   */
  disminuirStock(id: string, cantidad: number): boolean {
    const prod = this.productos.find(p => p.id === id);
    if (prod && prod.stock >= cantidad) {
      prod.stock -= cantidad;
      this.guardarProductos();
      return true;
    }
    return false;
  }
}