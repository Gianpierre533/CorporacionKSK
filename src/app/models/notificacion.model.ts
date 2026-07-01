export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
  tipo: 'solicitud' | 'cotizacion' | 'sistema';
  destinatarioRol: 'empleado' | 'cliente';
  referenciaId?: string;
}
