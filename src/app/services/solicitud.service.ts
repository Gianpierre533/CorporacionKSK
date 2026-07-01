// ============================================================
//  SOLICITUD SERVICE
//  Gestiona las solicitudes de cotización de los clientes.
//  Usa localStorage como almacenamiento local hasta integrar Firebase.
// ============================================================

import { Injectable, inject } from '@angular/core';
import { Solicitud, EstadoSolicitud } from '../models/solicitud.model';
import { NotificacionService } from './notificacion.service';

const STORAGE_KEY = 'ksk_solicitudes';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private notifService = inject(NotificacionService);

  /** Obtiene todas las solicitudes ordenadas por fecha descendente */
  getAll(): Solicitud[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const lista: Solicitud[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(lista)
        ? [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha))
        : [];
    } catch {
      return [];
    }
  }

  /** Guarda una nueva solicitud */
  crear(solicitud: Omit<Solicitud, 'id' | 'fecha' | 'estado'>): Solicitud {
    const lista = this.getAll();
    const nueva: Solicitud = {
      id: 'SOL-' + Date.now(),
      fecha: new Date().toISOString(),
      estado: 'Nueva',
      ...solicitud
    };
    lista.unshift(nueva);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

    // Generar notificación para el empleado
    this.notifService.crear({
      titulo: 'Nueva Solicitud de Cotización',
      mensaje: `El cliente ${nueva.clienteNombre} ha enviado una solicitud: "${nueva.descripcion.substring(0, 45)}${nueva.descripcion.length > 45 ? '...' : ''}"`,
      tipo: 'solicitud',
      destinatarioRol: 'empleado',
      referenciaId: nueva.id
    });

    return nueva;
  }

  /** Cambia el estado de una solicitud (uso exclusivo del empleado) */
  cambiarEstado(id: string, estado: EstadoSolicitud): void {
    const lista = this.getAll();
    const idx = lista.findIndex(s => s.id === id);
    if (idx !== -1) {
      lista[idx].estado = estado;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    }
  }

  /** Cuenta las solicitudes con estado 'Nueva' */
  contarNuevas(): number {
    return this.getAll().filter(s => s.estado === 'Nueva').length;
  }
}

