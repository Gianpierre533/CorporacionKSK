// ============================================================
//  SOLICITUD MODEL
//  Representa una solicitud de cotización enviada por el cliente.
//  Se persiste en localStorage bajo la clave 'ksk_solicitudes'.
//  El Dashboard del empleado las lee y puede cambiar su estado.
// ============================================================

export type EstadoSolicitud = 'Nueva' | 'En revisión' | 'Respondida';

export interface Solicitud {
  id: string;
  fecha: string;           // ISO 8601
  clienteNombre: string;
  clienteTelefono: string;
  descripcion: string;     // Qué necesita el cliente
  estado: EstadoSolicitud;
}
