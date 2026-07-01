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

  // ── RUTAS DE TRABAJADOR (pages/trabajador/) ─────────────
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/trabajador/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'cotizacion/nueva',
    loadComponent: () => import('./pages/cliente/generar-cotizacion/generar-cotizacion.page').then(m => m.GenerarCotizacionPage)
  },
  {
    path: 'resumen-cotizacion/:id',
    loadComponent: () => import('./pages/cliente/resumen-cotizacion/resumen-cotizacion.page').then(m => m.ResumenCotizacionPage)
  },
  {
    path: 'cotizacion/historial',
    loadComponent: () => import('./pages/cliente/historial-cotizaciones/historial-cotizaciones.page').then(m => m.HistorialCotizacionesPage)
  },

  // ── RUTAS DE CLIENTE (pages/cliente/) ───────────────────
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/cliente/catalogo/catalogo.page').then(m => m.CatalogoPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/cliente/checkout/checkout.page').then(m => m.CheckoutPage)
  },
  {
    path: 'mis-compras',
    loadComponent: () => import('./pages/cliente/mis-compras/mis-compras.page').then(m => m.MisComprasPage)
  },
  {
    path: 'solicitar-cotizacion',
    loadComponent: () => import('./pages/cliente/solicitar-cotizacion/solicitar-cotizacion.page').then(m => m.SolicitarCotizacionPage)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/cliente/contacto/contacto.page').then(m => m.ContactoPage)
  },
  {
    path: 'ofertas',
    loadComponent: () => import('./pages/cliente/ofertas/ofertas.page').then(m => m.OfertasPage)
  }
];