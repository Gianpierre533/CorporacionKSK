// ============================================================
//  PÁGINA: LoginPage
//  Tras el login exitoso guarda el nombre en localStorage
//  y navega al Menú Principal.
// ============================================================

import { Component } from '@angular/core';
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
  arrowBackOutline, personOutline,
  lockClosedOutline, eyeOutline, eyeOffOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon, IonSpinner]
})
export class LoginPage {

  form: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ arrowBackOutline, personOutline, lockClosedOutline, eyeOutline, eyeOffOutline });

    this.form = this.fb.group({
      usuario:    ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading = true;

    setTimeout(async () => {
      this.isLoading = false;

      // Guardamos el nombre del usuario en localStorage.
      // El menú principal lo leerá para el saludo "¡Hola, [nombre]!"
      const nombreUsuario = this.form.value.usuario;
      localStorage.setItem('ksk_usuario', nombreUsuario);

      // Navegamos al menú principal, reemplazando el historial
      // para que el botón "atrás" no regrese al login.
      this.router.navigate(['/menu'], { replaceUrl: true });
    }, 1500);
  }

  goBack() {
    this.router.navigate(['/bienvenida']);
  }
}