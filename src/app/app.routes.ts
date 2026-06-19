// ============================================================
//  RUTAS COMPLETAS DE LA APLICACIÓN (ORGANIZADO POR ROLES)
//
//  Flujo:
//    / (splash) → /bienvenida → /login → /menu
// ============================================================

import { Routes } from '@angular/router';

export const routes: Routes = [

  // ── Splash ──────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },

  // ── RUTAS COMUNES (pages/comun/) ────────────────────────
  {
    path: 'bienvenida',
    loadComponent: () => import('./pages/comun/bienvenida/bienvenida.page').then(m => m.BienvenidaPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/comun/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/comun/registro/registro.page').then(m => m.RegistroPage)
  },

  // ── MENÚ PRINCIPAL ──────────────────────────────────────
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu-principal/menu-principal.page').then(m => m.MenuPrincipalPage)
  },

  // ── RUTAS DE GESTIÓN (pages/trabajador/) ────────────────
  {
    path: 'empleados',
    loadComponent: () => import('./pages/trabajador/empleado-list/empleado-list.page').then(m => m.EmpleadoListPage)
  },
  {
    path: 'empleados/nuevo',
    loadComponent: () => import('./pages/trabajador/empleado-form/empleado-form.page').then(m => m.EmpleadoFormPage)
  },
  {
    path: 'empleados/editar/:id',
    loadComponent: () => import('./pages/trabajador/empleado-form/empleado-form.page').then(m => m.EmpleadoFormPage)
  },

  // ── RUTAS DE CLIENTE/COTIZACIÓN (pages/cliente/) ────────
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/cliente/catalogo/catalogo.page').then(m => m.CatalogoPage)
  },
  {
    path: 'cotizacion/nueva',
    loadComponent: () => import('./pages/cliente/generar-cotizacion/generar-cotizacion.page').then(m => m.GenerarCotizacionPage)
  },
  {
    // ── CORRECCIÓN AQUÍ ──
    // Cambiado de 'cotizacion/resumen/:id' a 'resumen-cotizacion/:id'
    path: 'resumen-cotizacion/:id',
    loadComponent: () => import('./pages/cliente/resumen-cotizacion/resumen-cotizacion.page').then(m => m.ResumenCotizacionPage)
  },
  {
    path: 'cotizacion/historial',
    loadComponent: () => import('./pages/cliente/historial-cotizaciones/historial-cotizaciones.page').then(m => m.HistorialCotizacionesPage)
  },  {
    path: 'checkout',
    loadComponent: () => import('./pages/cliente/checkout/checkout.page').then( m => m.CheckoutPage)
  },


];