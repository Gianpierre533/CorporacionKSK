// ============================================================
//  RUTAS COMPLETAS DE LA APLICACIÓN
//
//  Flujo:
//    / (splash 2.5s) → /bienvenida → /login → /menu
//    /menu → /catalogo | /cotizacion/nueva | /cotizacion/historial | /empleados
// ============================================================

import { Routes } from '@angular/router';

export const routes: Routes = [

  // ── Splash ──────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },

  // ── Bienvenida ──────────────────────────────────────────
  {
    path: 'bienvenida',
    loadComponent: () =>
      import('./pages/bienvenida/bienvenida.page').then(m => m.BienvenidaPage)
  },

  // ── Login ───────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },

  // ── Menú Principal ──────────────────────────────────────
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu-principal/menu-principal.page').then(m => m.MenuPrincipalPage)
  },

  // ── Catálogo ────────────────────────────────────────────
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo/catalogo.page').then(m => m.CatalogoPage)
  },

  // ── Cotizaciones ────────────────────────────────────────
  {
    path: 'cotizacion/nueva',
    loadComponent: () =>
      import('./pages/generar-cotizacion/generar-cotizacion.page')
        .then(m => m.GenerarCotizacionPage)
  },
  {
    path: 'cotizacion/resumen/:id',
    loadComponent: () =>
      import('./pages/resumen-cotizacion/resumen-cotizacion.page')
        .then(m => m.ResumenCotizacionPage)
  },
  {
    path: 'cotizacion/historial',
    loadComponent: () =>
      import('./pages/historial-cotizaciones/historial-cotizaciones.page')
        .then(m => m.HistorialCotizacionesPage)
  },

  // ── Empleados ───────────────────────────────────────────
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

  // ── Comodín: siempre al final ────────────────────────────
  { path: '**', redirectTo: '' }

];