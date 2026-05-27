// ============================================================
//  SERVICIO: EmpleadoService
//
//  Un "Service" en Angular es una clase con @Injectable que
//  centraliza la lógica de negocio y datos. Los componentes
//  (páginas) NO deberían saber CÓMO se guardan los datos,
//  solo piden al servicio que lo haga.
//
//  Ventaja: si mañana cambias de localStorage a una API real,
//  solo modificas ESTE archivo, no todas las páginas.
// ============================================================

import { Injectable } from '@angular/core';
import { Empleado } from '../models/empleado.model';

// @Injectable({ providedIn: 'root' }) significa:
//   - Esta clase PUEDE ser inyectada en otros componentes/servicios
//   - 'root' = Angular crea UNA sola instancia para toda la app
//     (patrón Singleton: todos comparten el mismo servicio)
@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  // Clave con la que guardaremos los datos en localStorage.
  // Es como el "nombre del cajón" donde guardamos la información.
  private readonly STORAGE_KEY = 'ksk_empleados';

  // ============================================================
  //  OBTENER TODOS LOS EMPLEADOS
  //  Lee el localStorage, convierte el texto JSON a un array
  //  de objetos Empleado y lo devuelve.
  //  Si no hay nada guardado, devuelve un array vacío [].
  // ============================================================
  getAll(): Empleado[] {
    // localStorage solo guarda texto. JSON.parse convierte
    // ese texto de vuelta a un objeto JavaScript.
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // ============================================================
  //  OBTENER UN EMPLEADO POR ID
  //  Busca dentro del array el empleado cuyo id coincida.
  //  "find" devuelve el primer elemento que cumpla la condición,
  //  o "undefined" si no lo encuentra.
  // ============================================================
  getById(id: string): Empleado | undefined {
    return this.getAll().find(emp => emp.id === id);
  }

  // ============================================================
  //  CREAR UN NUEVO EMPLEADO
  //  Recibe los datos del formulario (sin id ni fecha, esos
  //  los generamos aquí), construye el objeto completo y lo
  //  agrega al array existente.
  //
  //  "Omit<Empleado, 'id' | 'fechaRegistro'>" es TypeScript puro:
  //  significa "un Empleado pero SIN los campos id y fechaRegistro"
  //  Así el formulario no necesita preocuparse por esos campos.
  // ============================================================
  create(data: Omit<Empleado, 'id' | 'fechaRegistro'>): Empleado {
    const empleados = this.getAll();

    const newEmpleado: Empleado = {
      ...data,                                    // Copia todos los campos del formulario
      id: this.generateId(),                      // Genera un ID único
      fechaRegistro: new Date().toISOString()     // Fecha y hora actuales
    };

    empleados.push(newEmpleado); // Agrega al final del array
    this.save(empleados);        // Guarda el array actualizado
    return newEmpleado;          // Devuelve el empleado creado
  }

  // ============================================================
  //  ACTUALIZAR UN EMPLEADO EXISTENTE
  //  Busca el empleado por id y reemplaza sus datos.
  //  "map" recorre el array: si el id coincide, devuelve el
  //  empleado actualizado; si no, devuelve el mismo sin cambios.
  // ============================================================
  update(id: string, data: Omit<Empleado, 'id' | 'fechaRegistro'>): Empleado | null {
    const empleados = this.getAll();
    let updated: Empleado | null = null;

    const newList = empleados.map(emp => {
      if (emp.id === id) {
        updated = { ...emp, ...data }; // Mezcla datos viejos con nuevos
        return updated;
      }
      return emp; // Sin cambios
    });

    if (updated) {
      this.save(newList);
    }

    return updated;
  }

  // ============================================================
  //  ELIMINAR UN EMPLEADO
  //  "filter" crea un NUEVO array con todos los empleados
  //  EXCEPTO el que tiene el id indicado.
  // ============================================================
  delete(id: string): void {
    const empleados = this.getAll().filter(emp => emp.id !== id);
    this.save(empleados);
  }

  // ============================================================
  //  BUSCAR EMPLEADOS
  //  Filtra por nombre, DNI o cargo que contengan el texto
  //  buscado. "toLowerCase" hace la búsqueda sin importar
  //  si está en mayúsculas o minúsculas.
  // ============================================================
  search(query: string): Empleado[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();

    return this.getAll().filter(emp =>
      emp.nombres.toLowerCase().includes(q) ||
      emp.dni.toLowerCase().includes(q) ||
      emp.cargo.toLowerCase().includes(q)
    );
  }

  // ============================================================
  //  MÉTODOS PRIVADOS (solo los usa este servicio internamente)
  // ============================================================

  // Convierte el array a texto JSON y lo guarda en localStorage.
  // JSON.stringify = JavaScript object → texto
  private save(empleados: Empleado[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(empleados));
  }

  // Genera un ID único combinando la fecha actual (en milisegundos)
  // con un número aleatorio. Ej: "1714320000000-4521"
  // Esto garantiza que dos empleados nunca tengan el mismo ID.
  private generateId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}