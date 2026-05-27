// ============================================================
//  RUTAS COMPLETAS DE LA APLICACIÓN
//
//  Flujo:
//    / (splash 2.5s) → /bienvenida → /login → /menu
//    /menu → /catalogo | /cotizacion/nueva | /cotizacion/historial | /empleados
// ============================================================

import { Routes } from '@angular/router';

export const routes: Routes = [

  // --- Splash ---
  {
    path: '',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },

  // --- Bienvenida ---
  {
    path: 'bienvenida',
    loadComponent: () =>
      import('./pages/bienvenida/bienvenida.page').then(m => m.BienvenidaPage)
  },

  // --- Login ---
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },

  // --- Menú Principal (hub central) ---
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu-principal/menu-principal.page').then(m => m.MenuPrincipalPage)
  },

  // --- Empleados ---
  {
    path: 'empleados',
    loadComponent: () =>
      import('./pages/empleado-list/empleado-list.page').then(m => m.EmpleadoListPage)
  },
  {
    path: 'empleados/nuevo',
    loadComponent: () =>
      import('./pages/empleado-form/empleado-form.page').then(m => m.EmpleadoFormPage)
  },
  {
    path: 'empleados/editar/:id',
    loadComponent: () =>
      import('./pages/empleado-form/empleado-form.page').then(m => m.EmpleadoFormPage)
  },

  // --- Comodín ---
  { path: '**', redirectTo: '' }
];