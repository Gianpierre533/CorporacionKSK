import { Injectable } from '@angular/core';
import { Notificacion } from '../models/notificacion.model';

const STORAGE_KEY = 'ksk_notificaciones';

@Injectable({ providedIn: 'root' })
export class NotificacionService {

  getAll(): Notificacion[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const lista: Notificacion[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(lista)
        ? [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha))
        : [];
    } catch {
      return [];
    }
  }

  getPorRol(rol: 'empleado' | 'cliente'): Notificacion[] {
    return this.getAll().filter(n => n.destinatarioRol === rol);
  }

  contarNoLeidas(rol: 'empleado' | 'cliente'): number {
    return this.getPorRol(rol).filter(n => !n.leido).length;
  }

  crear(notif: Omit<Notificacion, 'id' | 'fecha' | 'leido'>): Notificacion {
    const lista = this.getAll();
    const nueva: Notificacion = {
      id: 'NOT-' + Date.now(),
      fecha: new Date().toISOString(),
      leido: false,
      ...notif
    };
    lista.unshift(nueva);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    return nueva;
  }

  marcarComoLeida(id: string): void {
    const lista = this.getAll();
    const idx = lista.findIndex(n => n.id === id);
    if (idx !== -1) {
      lista[idx].leido = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    }
  }

  marcarTodasComoLeidas(rol: 'empleado' | 'cliente'): void {
    const lista = this.getAll();
    const actualizadas = lista.map(n => {
      if (n.destinatarioRol === rol) {
        return { ...n, leido: true };
      }
      return n;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
  }

  eliminar(id: string): void {
    const lista = this.getAll();
    const filtrado = lista.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrado));
  }

  eliminarTodas(rol: 'empleado' | 'cliente'): void {
    const lista = this.getAll();
    const filtrado = lista.filter(n => n.destinatarioRol !== rol);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrado));
  }
}
