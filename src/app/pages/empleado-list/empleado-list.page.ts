import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonIcon,
  IonFab, IonFabButton, IonSearchbar, IonBadge,
  IonItemSliding, IonItemOptions, IonItemOption,
  AlertController, ToastController, IonButtons, IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, pencilOutline, trashOutline, personOutline } from 'ionicons/icons';

import { EmpleadoService } from '../../services/empleado';
import { Empleado } from '../../models/empleado.model';

@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonIcon, IonButtons, IonText,
    IonFab, IonFabButton, IonSearchbar, IonBadge,
    IonItemSliding, IonItemOptions, IonItemOption
  ]
})
export class EmpleadoListPage implements OnInit {

  // Array que muestra el HTML. Puede ser todos los empleados
  // o el resultado filtrado de una búsqueda.
  empleados: Empleado[] = [];

  // Texto ingresado en la barra de búsqueda
  searchQuery = '';

  constructor(
    private empleadoService: EmpleadoService,
    private router: Router,
    private alertCtrl: AlertController,   // Diálogos de confirmación
    private toastCtrl: ToastController    // Notificaciones emergentes
  ) {
    // Registrar iconos de Ionicons que usaremos en el HTML
    // Ionic usa un sistema "lazy" de iconos, hay que registrarlos
    addIcons({ addOutline, pencilOutline, trashOutline, personOutline });
  }

  ngOnInit() {
    this.loadEmpleados();
  }

  // ============================================================
  //  ionViewWillEnter: Lifecycle hook de Ionic
  //  Se ejecuta CADA VEZ que la página se muestra al usuario,
  //  no solo la primera vez (a diferencia de ngOnInit).
  //  Esto es importante para refrescar la lista cuando el usuario
  //  regresa tras crear o editar un empleado.
  // ============================================================
  ionViewWillEnter() {
    this.loadEmpleados();
  }

  // ============================================================
  //  CARGAR EMPLEADOS
  //  Si hay búsqueda activa, filtra. Si no, carga todos.
  // ============================================================
  loadEmpleados() {
    if (this.searchQuery.trim()) {
      this.empleados = this.empleadoService.search(this.searchQuery);
    } else {
      this.empleados = this.empleadoService.getAll();
    }
  }

  // ============================================================
  //  BÚSQUEDA EN TIEMPO REAL
  //  Se llama cada vez que el usuario escribe en el searchbar.
  //  (ionInput) emite el evento con cada pulsación de tecla.
  // ============================================================
  onSearch(event: CustomEvent) {
    this.searchQuery = event.detail.value ?? '';
    this.loadEmpleados();
  }

  // ============================================================
  //  LIMPIAR BÚSQUEDA
  // ============================================================
  onClearSearch() {
    this.searchQuery = '';
    this.loadEmpleados();
  }

  // ============================================================
  //  NAVEGAR AL FORMULARIO DE CREACIÓN
  // ============================================================
  goToCreate() {
    this.router.navigate(['/empleados/new']);
  }

  // ============================================================
  //  NAVEGAR AL FORMULARIO DE EDICIÓN
  //  Pasamos el id en la URL: /empleados/edit/abc123
  // ============================================================
  goToEdit(empleado: Empleado) {
    this.router.navigate(['/empleados/edit', empleado.id]);
  }

  // ============================================================
  //  ELIMINAR EMPLEADO (con diálogo de confirmación)
  //  Siempre pedir confirmación antes de borrar datos.
  //  AlertController muestra un popup nativo de la plataforma.
  // ============================================================
  async confirmDelete(empleado: Empleado, slidingItem?: IonItemSliding) {
    // Cerrar el sliding si viene de un swipe
    if (slidingItem) await slidingItem.close();

    const alert = await this.alertCtrl.create({
      header: 'Eliminar empleado',
      message: `¿Estás seguro de que quieres eliminar a <strong>${empleado.nombres}</strong>? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'   // role 'cancel' no ejecuta handler
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'danger-btn',
          handler: () => this.deleteEmpleado(empleado.id)
        }
      ]
    });

    await alert.present();
  }

  // ============================================================
  //  EJECUTAR ELIMINACIÓN
  // ============================================================
  private async deleteEmpleado(id: string) {
    this.empleadoService.delete(id);
    this.loadEmpleados(); // Recargar lista

    const toast = await this.toastCtrl.create({
      message: 'Empleado eliminado',
      duration: 2000,
      color: 'warning',
      position: 'bottom'
    });
    await toast.present();
  }

  // ============================================================
  //  FORMATEAR FECHA
  //  Convierte el string ISO a formato legible: "15 ene 2025"
  // ============================================================
  formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // ============================================================
  //  INICIALES DEL EMPLEADO (para el avatar)
  //  "Juan Pérez García" → "JP"
  // ============================================================
  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word[0]?.toUpperCase() ?? '')
      .join('');
  }
}