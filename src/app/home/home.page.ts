import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent]
})
export class HomePage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // El temporizador del Splash dura 2.5 segundos
    setTimeout(() => {
      
      // ── EL CAMBIO CLAVE AQUÍ ──
      // Tu código actual debe decir ['/login']. 
      // Cámbialo exactamente a ['/bienvenida'] para que salte al nuevo Onboarding corporativo.
      this.router.navigate(['/bienvenida'], { replaceUrl: true });

    }, 2500);
  }
}