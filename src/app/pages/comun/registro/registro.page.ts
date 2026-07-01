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
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // 🛠️ FUNCIÓN MEJORADA: Controla que los mensajes de error no salgan al inicio
  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && (control?.touched || this.submitted));
  }

  // 🛠️ FUNCIÓN MEJORADA: Evita que los bordes se pongan rojos prematuramente
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  async onRegister() {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isLoading = true;

    // Simulación de guardado rápido
    setTimeout(() => {
      this.isLoading = false;

      const nombreCompleto = this.form.value.nombre;
      
      // Guardamos datos clave en el almacenamiento local
      localStorage.setItem('ksk_usuario', nombreCompleto);
      localStorage.setItem('ksk_rol', 'cliente'); 

      // Redirección directa y limpia al catálogo del cliente (Sin mensajitos molestos)
      this.router.navigate(['/cliente/catalogo'], { replaceUrl: true });
    }, 1000); 
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}