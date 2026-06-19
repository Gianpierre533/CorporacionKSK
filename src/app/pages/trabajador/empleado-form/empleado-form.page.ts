import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators
} from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonSpinner, IonButtons, IonBackButton,
  ToastController, LoadingController
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personOutline, cardOutline, briefcaseOutline,
  callOutline, mailOutline, saveOutline,
  personAddOutline, arrowBackOutline
} from 'ionicons/icons';
import { EmpleadoService } from '../../../services/empleado.service';

@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.page.html',
  styleUrls: ['./empleado-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonIcon, IonSpinner, IonButtons, IonBackButton
  ]
})
export class EmpleadoFormPage implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  empleadoId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private empleadoService: EmpleadoService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      personOutline, cardOutline, briefcaseOutline,
      callOutline, mailOutline, saveOutline,
      personAddOutline, arrowBackOutline
    });
  }

  ngOnInit() {
    this.buildForm();
    this.checkEditMode();
  }

  ionViewWillEnter() {
    const rol = localStorage.getItem('ksk_rol');
    if (rol !== 'admin') {
      // 🛠️ Ruta corregida: menú de trabajador
      this.router.navigate(['/trabajador/menu']);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      nombres:  ['', [Validators.required, Validators.minLength(3)]],
      dni:      ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      cargo:    ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      correo:   ['', [Validators.required, Validators.email]]
    });
  }

  private checkEditMode() {
    this.empleadoId = this.route.snapshot.paramMap.get('id');
    if (this.empleadoId) {
      this.isEditMode = true;
      const emp = this.empleadoService.getById(this.empleadoId);
      if (emp) {
        this.form.patchValue({
          nombres: emp.nombres, dni: emp.dni,
          cargo: emp.cargo, telefono: emp.telefono, correo: emp.correo
        });
      } else {
        // 🛠️ Ruta corregida: listado de empleados protegido
        this.router.navigate(['/trabajador/empleados']);
      }
    }
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({
      message: this.isEditMode ? 'Actualizando...' : 'Registrando...',
      duration: 800
    });
    await loading.present();

    try {
      const data = this.form.value;
      if (this.isEditMode && this.empleadoId) {
        this.empleadoService.update(this.empleadoId, data);
        await this.showToast('Empleado actualizado correctamente', 'success');
      } else {
        this.empleadoService.create(data);
        await this.showToast('Empleado registrado correctamente', 'success');
      }
      await loading.dismiss();
      
      // 🛠️ Ruta corregida: regresa al listado protegido al guardar con éxito
      this.router.navigate(['/trabajador/empleados']);
    } catch {
      await loading.dismiss();
      await this.showToast('Ocurrió un error. Intenta de nuevo.', 'danger');
      this.isSubmitting = false;
    }
  }

  get f() { return this.form.controls; }

  hasError(field: string, error: string): boolean {
    const c = this.form.get(field);
    return !!(c?.hasError(error) && c?.touched);
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message, duration: 2500, color, position: 'bottom'
    });
    await toast.present();
  }
}