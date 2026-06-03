// ============================================================
//  SERVICIO: CotizacionService
//  Maneja toda la lógica de cotizaciones con localStorage.
//  Mismo patrón que EmpleadoService.
// ============================================================

import { Injectable } from '@angular/core';
import {
  Cotizacion, ItemCotizacion,
  ClienteCotizacion, EstadoCotizacion
} from '../models/cotizacion.model';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  private readonly STORAGE_KEY = 'ksk_cotizaciones';
  private readonly CONTADOR_KEY = 'ksk_cotizacion_contador';

  // ── Obtener todas ─────────────────────────────────────────
  getAll(): Cotizacion[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // ── Obtener por ID ────────────────────────────────────────
  getById(id: string): Cotizacion | undefined {
    return this.getAll().find(c => c.id === id);
  }

  // ── Crear nueva cotización ────────────────────────────────
  // Recibe los items y datos del cliente, calcula los totales
  // automáticamente y genera el número correlativo.
  create(
    items: ItemCotizacion[],
    cliente: ClienteCotizacion
  ): Cotizacion {
    const numero = this.siguienteNumero();
    const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
    const igv      = Math.round(subtotal * 0.18 * 100) / 100;
    const total    = Math.round((subtotal + igv) * 100) / 100;

    const nueva: Cotizacion = {
      id:       `COT-${String(numero).padStart(5, '0')}`, // COT-00025
      numero,
      fecha:    new Date().toISOString(),
      cliente,
      items,
      subtotal,
      igv,
      total,
      estado:   'Pendiente'
    };

    const lista = this.getAll();
    lista.unshift(nueva); // agrega al inicio (más reciente primero)
    this.guardar(lista);
    return nueva;
  }

  // ── Cambiar estado ────────────────────────────────────────
  // Permite marcar una cotización como Enviada, Aceptada, etc.
  cambiarEstado(id: string, estado: EstadoCotizacion): void {
    const lista = this.getAll().map(c =>
      c.id === id ? { ...c, estado } : c
    );
    this.guardar(lista);
  }

  // ── Eliminar ──────────────────────────────────────────────
  delete(id: string): void {
    this.guardar(this.getAll().filter(c => c.id !== id));
  }

  // ── Buscar ────────────────────────────────────────────────
  search(query: string): Cotizacion[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();
    return this.getAll().filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.cliente.nombre.toLowerCase().includes(q)
    );
  }

  // ── Filtrar por estado ────────────────────────────────────
  filtrarPorEstado(estado: EstadoCotizacion): Cotizacion[] {
    return this.getAll().filter(c => c.estado === estado);
  }

  // ── Métodos privados ──────────────────────────────────────

  // Genera el número correlativo leyendo y sumando el contador
  private siguienteNumero(): number {
    const actual = parseInt(
      localStorage.getItem(this.CONTADOR_KEY) ?? '0', 10
    );
    const siguiente = actual + 1;
    localStorage.setItem(this.CONTADOR_KEY, String(siguiente));
    return siguiente;
  }

  private guardar(cotizaciones: Cotizacion[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(cotizaciones)
    );
  }
}