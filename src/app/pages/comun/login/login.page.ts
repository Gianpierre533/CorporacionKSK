// ============================================================
//  PÁGINA: LoginPage
//  Diseño con blob de ondas + glow cyan.
//  Optimizado para mejor UX y manejo de errores.
// ============================================================

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators
} from '@angular/forms';
import {
  IonContent, IonIcon, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline, personOutline,
  lockClosedOutline, eyeOutline, eyeOffOutline,
  briefcaseOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon, IonSpinner]
})
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);


  form!: FormGroup;
  showPassword    = false;
  isLoading       = false;
  submitted       = false;
  usernameFocused = false;
  passwordFocused = false;
  rolSeleccionado: 'cliente' | 'empleado' = 'cliente';

  get f() {
    return this.form.controls;
  }

  constructor() {
    addIcons({
      chevronBackOutline, personOutline,
      lockClosedOutline, eyeOutline, eyeOffOutline,
      briefcaseOutline
    });
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      usuario:    ['', [Validators.required]],
      contrasena: ['', [Validators.required]] 
    });
  }

  setRol(rol: 'cliente' | 'empleado') {
    this.rolSeleccionado = rol;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && (control?.touched || this.submitted));
  }

  isFieldInvalid(field: 'usuario' | 'contrasena'): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  async onSubmit() {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) return; 

    this.isLoading = true;

    setTimeout(async () => {
      this.isLoading = false;

      const valorUsuario = this.form.value.usuario.toLowerCase().trim();
      let nombreParaMostrar = this.form.value.usuario;
      const rolAsignado = this.rolSeleccionado;

      if (rolAsignado === 'empleado') {
        if (valorUsuario === 'carlos' || valorUsuario.includes('empleado')) {
          nombreParaMostrar = 'Carlos (Vendedor)';
        } else {
          // Capitalizar primer letra para estética
          nombreParaMostrar = this.form.value.usuario.charAt(0).toUpperCase() + this.form.value.usuario.slice(1) + ' (Vendedor)';
        }
      } else {
        if (valorUsuario === 'juan' || valorUsuario.includes('cliente')) {
          nombreParaMostrar = 'Juan Pérez (Cliente)';
        } else {
          nombreParaMostrar = this.form.value.usuario.charAt(0).toUpperCase() + this.form.value.usuario.slice(1);
        }
      }

      localStorage.setItem('ksk_usuario', nombreParaMostrar);
      localStorage.setItem('ksk_rol', rolAsignado);

      this.router.navigate(['/menu'], { replaceUrl: true });
      
    }, 1200);
  }

  goBack() {
    this.router.navigate(['/bienvenida']);
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}