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

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private readonly STORAGE_KEY = 'ksk_empleados';

  getAll(): Empleado[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getById(id: string): Empleado | undefined {
    return this.getAll().find(emp => emp.id === id);
  }

  create(data: Omit<Empleado, 'id' | 'fechaRegistro'>): Empleado {
    const empleados = this.getAll();

    const newEmpleado: Empleado = {
      ...data,
      id: this.generateId(),
      fechaRegistro: new Date().toISOString()
    };

    empleados.push(newEmpleado);
    this.save(empleados);
    return newEmpleado;
  }

  update(id: string, data: Omit<Empleado, 'id' | 'fechaRegistro'>): Empleado | null {
    const empleados = this.getAll();
    let updated: Empleado | null = null;

    const newList = empleados.map(emp => {
      if (emp.id === id) {
        updated = { ...emp, ...data };
        return updated;
      }
      return emp;
    });

    if (updated) {
      this.save(newList);
    }

    return updated;
  }

  delete(id: string): void {
    const empleados = this.getAll().filter(emp => emp.id !== id);
    this.save(empleados);
  }

  search(query: string): Empleado[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();

    return this.getAll().filter(emp =>
      emp.nombres.toLowerCase().includes(q) ||
      emp.dni.toLowerCase().includes(q) ||
      emp.cargo.toLowerCase().includes(q)
    );
  }

  private save(empleados: Empleado[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(empleados));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}
