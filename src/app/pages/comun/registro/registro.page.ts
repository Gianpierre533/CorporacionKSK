import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, FormBuilder, FormGroup, Validators,
  FormsModule 
} from '@angular/forms';
import { 
  IonContent, IonIcon, IonSpinner, ToastController 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, personOutline, lockClosedOutline, eyeOutline, eyeOffOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonContent, IonIcon, IonSpinner] 
})
export class RegistroPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  form!: FormGroup;
  showPassword = false;
  isLoading = false;
  submitted = false;

  get f() { return this.form.controls; }

  constructor() {
    addIcons({ chevronBackOutline, personOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Controla que los mensajes de error no salgan al inicio
  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && (control?.touched || this.submitted));
  }

  // Evita que los bordes se pongan rojos prematuramente
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  async onRegister() {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isLoading = true;

    setTimeout(async () => {
      const usernameInput = this.form.value.usuario.toLowerCase().trim();
      const contrasenaInput = this.form.value.contrasena;
      const nombreInput = this.form.value.nombre;

      try {
        const raw = localStorage.getItem('ksk_clientes_registrados');
        const clientes: any[] = raw ? JSON.parse(raw) : [];

        // Validar si ya existe el usuario
        const existe = clientes.some(c => c.usuario === usernameInput);
        if (existe) {
          this.isLoading = false;
          const toast = await this.toastCtrl.create({
            message: '⚠️ El nombre de usuario ya existe. Intenta con otro.',
            duration: 2500,
            color: 'warning',
            position: 'bottom'
          });
          await toast.present();
          return;
        }

        // Registrar cliente
        const nuevoCliente = {
          nombre: nombreInput,
          usuario: usernameInput,
          contrasena: contrasenaInput
        };

        clientes.push(nuevoCliente);
        localStorage.setItem('ksk_clientes_registrados', JSON.stringify(clientes));

        // Auto-login (guarda nombre completo y rol)
        localStorage.setItem('ksk_usuario', nuevoCliente.nombre);
        localStorage.setItem('ksk_rol', 'cliente');

        this.isLoading = false;

        const toast = await this.toastCtrl.create({
          message: '🎉 ¡Registro completado y sesión iniciada!',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();

        // Redirección directa al menú principal
        this.router.navigate(['/menu'], { replaceUrl: true });
      } catch (e) {
        this.isLoading = false;
        console.error('Error al registrar usuario', e);
      }
    }, 1000); 
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}