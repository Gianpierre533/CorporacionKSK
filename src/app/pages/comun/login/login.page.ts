// ============================================================
//  PÁGINA: LoginPage
//  Diseño con blob de ondas + glow cyan.
//  Optimizado para mejor UX y manejo de errores.
// ============================================================

import { Component, OnInit } from '@angular/core';
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
  lockClosedOutline, eyeOutline, eyeOffOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon, IonSpinner]
})
export class LoginPage implements OnInit {

  form!: FormGroup;
  showPassword    = false;
  isLoading       = false;
  submitted       = false;
  usernameFocused = false;
  passwordFocused = false;

  get f() {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({
      chevronBackOutline, personOutline,
      lockClosedOutline, eyeOutline, eyeOffOutline
    });
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      usuario:    ['', [Validators.required]],
      // CORREGIDO: Se elimina Validators.minLength(6) para dejarlo a criterio del usuario
      contrasena: ['', [Validators.required]] 
    });
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
      let rolAsignado: 'admin' | 'empleado' | 'cliente' = 'cliente';

      if (valorUsuario.includes('admin') || valorUsuario === 'ana') {
        nombreParaMostrar = 'Ana (Gerente)';
        rolAsignado = 'admin';
      } else if (valorUsuario.includes('empleado') || valorUsuario === 'carlos') {
        nombreParaMostrar = 'Carlos (Vendedor)';
        rolAsignado = 'empleado';
      } else {
        nombreParaMostrar = this.form.value.usuario;
        rolAsignado = 'cliente';
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