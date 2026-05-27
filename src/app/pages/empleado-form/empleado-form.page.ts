// ============================================================
//  PÁGINA: EmpleadoFormPage
//  Sirve para DOS cosas según si viene con un "id" en la URL:
//    - Sin id  → Modo CREAR: registrar un nuevo empleado
//    - Con id  → Modo EDITAR: modificar un empleado existente
//
//  Este componente NO sabe cómo guardar datos, solo le dice
//  al EmpleadoService "guarda esto" o "actualiza esto".
// ============================================================
 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonItem, IonLabel, IonInput,
  IonBackButton, IonButtons, IonNote,
  ToastController, LoadingController
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../../services/empleado';
 
@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.page.html',
  standalone: true,
  // "imports" lista todo lo que usa el HTML de este componente.
  // Al ser standalone, no depende de un NgModule central.
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonItem, IonLabel, IonInput,
    IonBackButton, IonButtons, IonNote
  ]
})
export class EmpleadoFormPage implements OnInit {
 
  // FormGroup agrupa todos los campos del formulario.
  // TypeScript pide que lo inicialicemos, usamos "!" para
  // decirle "prometo que lo inicializo en ngOnInit".
  form!: FormGroup;
 
  // Variables de estado de la página
  isEditMode = false;        // ¿Estamos editando o creando?
  employeeId: string | null = null; // ID del empleado (si editamos)
  isSubmitting = false;      // Evita envíos dobles
 
  // ============================================================
  //  CONSTRUCTOR: Inyección de dependencias
  //  Angular nos "entrega" estos servicios automáticamente.
  //  No los instanciamos con "new", Angular los maneja.
  // ============================================================
  constructor(
    private fb: FormBuilder,           // Ayuda a construir formularios reactivos
    private route: ActivatedRoute,     // Lee parámetros de la URL
    private router: Router,            // Navega entre páginas
    private empleadoService: EmpleadoService,  // Nuestro servicio de datos
    private toastCtrl: ToastController,        // Notificaciones emergentes
    private loadingCtrl: LoadingController     // Spinner de carga
  ) {}
 
  // ============================================================
  //  ngOnInit: Se ejecuta cuando la página se INICIALIZA
  //  (justo antes de mostrarse al usuario)
  // ============================================================
  ngOnInit() {
    this.buildForm();
    this.checkEditMode();
  }
 
  // ============================================================
  //  CONSTRUIR EL FORMULARIO REACTIVO
  //  FormBuilder.group() crea el formulario con sus validaciones.
  //  Validators.required = campo obligatorio
  //  Validators.email    = debe tener formato de email
  //  Validators.pattern  = debe coincidir con una expresión regular
  //  Validators.minLength = mínimo de caracteres
  // ============================================================
  private buildForm() {
    this.form = this.fb.group({
      nombres: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      dni: ['', [
        Validators.required,
        Validators.pattern(/^\d{8}$/) // Exactamente 8 dígitos (DNI Perú)
      ]],
      cargo: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^\d{9}$/) // Exactamente 9 dígitos
      ]],
      correo: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }
 
  // ============================================================
  //  DETECTAR SI ESTAMOS EN MODO EDITAR
  //  La URL puede ser:
  //    /employees/new          → crear
  //    /employees/edit/abc123  → editar
  // ============================================================
  private checkEditMode() {
    this.employeeId = this.route.snapshot.paramMap.get('id');
 
    if (this.employeeId) {
      this.isEditMode = true;
      const empleado = this.empleadoService.getById(this.employeeId);
 
      if (empleado) {
        // Rellenar el formulario con los datos existentes
        // patchValue actualiza solo los campos que le pasemos
        this.form.patchValue({
          nombres: empleado.nombres,
          dni: empleado.dni,
          cargo: empleado.cargo,
          telefono: empleado.telefono,
          correo: empleado.correo
        });
      } else {
        // Si el ID no existe, volvemos atrás
        this.router.navigate(['/employees']);
      }
    }
  }
 
  // ============================================================
  //  ENVIAR EL FORMULARIO
  //  Se llama al presionar el botón "Guardar"
  // ============================================================
  async onSubmit() {
    // form.valid verifica que todas las validaciones pasen
    if (this.form.invalid || this.isSubmitting) return;
 
    // markAllAsTouched muestra los errores de todos los campos
    // (normalmente solo aparecen si el usuario los tocó)
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
 
    this.isSubmitting = true;
 
    // Mostrar spinner de carga
    const loading = await this.loadingCtrl.create({
      message: this.isEditMode ? 'Actualizando...' : 'Registrando...',
      duration: 800 // ms
    });
    await loading.present();
 
    // form.value devuelve un objeto con todos los valores del formulario
    const formData = this.form.value;
 
    try {
      if (this.isEditMode && this.employeeId) {
        this.empleadoService.update(this.employeeId, formData);
        await this.showToast('Empleado actualizado correctamente', 'success');
      } else {
        this.empleadoService.create(formData);
        await this.showToast('Empleado registrado correctamente', 'success');
      }
 
      await loading.dismiss();
      // Navegar a la lista tras guardar exitosamente
      this.router.navigate(['/employees']);
 
    } catch (error) {
      await loading.dismiss();
      await this.showToast('Ocurrió un error. Intenta de nuevo.', 'danger');
      this.isSubmitting = false;
    }
  }
 
  // ============================================================
  //  GETTER HELPERS: acceso fácil a los controles del formulario
  //  En el HTML usamos: errors.nombres?.required
  //  En vez de: form.get('nombres')?.errors?.['required']
  // ============================================================
  get f() {
    return this.form.controls;
  }
 
  // ¿Este campo tiene error Y ya fue tocado por el usuario?
  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }
 
  // ============================================================
  //  MOSTRAR TOAST (notificación emergente)
  // ============================================================
  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
 