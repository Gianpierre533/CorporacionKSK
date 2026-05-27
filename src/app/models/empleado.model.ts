// ============================================================
//  MODELO: Empleado
//  Un "modelo" o "interfaz" en TypeScript define la FORMA
//  que tendrá un objeto. Piénsalo como una plantilla que dice
//  "todo empleado DEBE tener estos campos con estos tipos".
//  Si intentas crear un empleado sin alguno de estos campos,
//  TypeScript te avisará con un error antes de ejecutar el código.
// ============================================================
 
export interface Empleado {
  id: string;          // Identificador único generado automáticamente
  nombres: string;     // Nombre y apellidos completos
  dni: string;         // Documento de identidad
  cargo: string;       // Puesto o cargo en la empresa
  telefono: string;    // Número de teléfono
  correo: string;      // Correo electrónico
  fechaRegistro: string; // Fecha en que fue registrado en el sistema
}
 
// ============================================================
//  ¿Por qué usamos "interface" y no "class"?
//  - Una "interface" solo define estructura (campos y tipos).
//  - Una "class" define estructura + comportamiento (métodos).
//  - Para modelos de datos simples como este, "interface" es
//    más ligera y suficiente.
// ============================================================
 