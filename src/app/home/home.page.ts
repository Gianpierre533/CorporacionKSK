// ============================================================
//  PÁGINA: HomePage (Splash)
//  Se muestra 2.5 segundos y navega automáticamente a /bienvenida.
// ============================================================

import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent]
})
export class HomePage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // setTimeout ejecuta una función después de N milisegundos (2500 = 2.5 segundos).
    // Tras ese tiempo, navega automáticamente a la pantalla de bienvenida.
    // { replaceUrl: true } evita que el usuario pueda volver al splash
    // presionando el botón "atrás" del dispositivo.
    setTimeout(() => {
      this.router.navigate(['/bienvenida'], { replaceUrl: true });
    }, 2500);
  }
}