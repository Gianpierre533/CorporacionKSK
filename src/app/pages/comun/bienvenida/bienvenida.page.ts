import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  cubeOutline, 
  documentTextOutline, 
  shieldCheckmarkOutline, 
  arrowForwardOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class BienvenidaPage {

  // Almacena dinámicamente el año actual para el pie de página
  anioActual: number = new Date().getFullYear();

  constructor(private router: Router) {
    // Registramos los iconos vectoriales específicos de la sección
    addIcons({ 
      cubeOutline, 
      documentTextOutline, 
      shieldCheckmarkOutline, 
      arrowForwardOutline 
    });
  }

  // Navega de forma segura hacia la vista de inicio de sesión
  irAlLogin() {
    this.router.navigate(['/login']);
  }

  // Navega hacia el formulario de registro de nuevos clientes
  irAlRegistro() {
    this.router.navigate(['/registro']);
  }
}