import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonFab, IonFabButton, IonBadge,
  IonButtons, IonBackButton,
  AlertController, ToastController, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addOutline, pencilOutline, trashOutline, personOutline,
  searchOutline, closeOutline, cardOutline,
  callOutline, chevronForwardOutline, arrowBackOutline
} from 'ionicons/icons';

import { EmpleadoService } from '../../../services/empleado.service';
import { Empleado } from '../../../models/empleado.model';

@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.page.html',
  styleUrls: ['./empleado-list.page.scss'],
  standalone: true,
  imports: [IonButton, 
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonIcon, IonBadge, IonButtons, IonButton,
    IonFab, IonFabButton
  ]
})
export class EmpleadoListPage implements OnInit {

  empleados: Empleado[] = [];
  searchQuery = '';

  constructor(
    private empleadoService: EmpleadoService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      addOutline, pencilOutline, trashOutline, personOutline,
      searchOutline, closeOutline, cardOutline,
      callOutline, chevronForwardOutline, arrowBackOutline
    });
  }

  ngOnInit() {
    this.loadEmpleados();
  }

  ionViewWillEnter() {
    const rol = localStorage.getItem('ksk_rol');
    if (rol !== 'admin') {
      this.router.navigate(['/menu'], { replaceUrl: true });
      return;
    }
    this.loadEmpleados();
  }

  // ── MÉTODO PROTEGIDO PARA EVITAR EL ERROR DE SORT ──
  loadEmpleados() {
    // Obtenemos los datos de forma segura
    const rawData = this.searchQuery.trim() 
                  ? this.empleadoService.search(this.searchQuery) 
                  : this.empleadoService.getAll();
    
    // Si rawData no es un arreglo (es undefined o null), asignamos []
    this.empleados = Array.isArray(rawData) ? rawData : [];
    
    // Si en el futuro necesitas ordenar, hazlo así:
    // this.empleados = [...this.empleados].sort((a, b) => a.nombres.localeCompare(b.nombres));
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement | null;
    this.searchQuery = target?.value ?? '';
    this.loadEmpleados();
  }

  onClearSearch() {
    this.searchQuery = '';
    this.loadEmpleados();
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  goToCreate() {
    this.router.navigate(['/empleados/nuevo']);
  }

  goToEdit(empleado: Empleado) {
    this.router.navigate(['/empleados/editar', empleado.id]);
  }

  async confirmDelete(empleado: Empleado) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar empleado',
      message: `¿Eliminar a <strong>${empleado.nombres}</strong>? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteEmpleado(empleado.id)
        }
      ]
    });
    await alert.present();
  }

  private async deleteEmpleado(id: string) {
    this.empleadoService.delete(id);
    this.loadEmpleados();
    const toast = await this.toastCtrl.create({
      message: 'Empleado eliminado',
      duration: 2000,
      color: 'warning',
      position: 'bottom'
    });
    await toast.present();
  }

  formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('');
  }
}