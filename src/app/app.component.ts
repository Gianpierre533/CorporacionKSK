import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  standalone: true
})
export class AppComponent implements OnInit {
  
  constructor() {}

  async ngOnInit() {
    // 📱 Verificamos si la app está corriendo de forma nativa en el celular
    if (Capacitor.isNativePlatform()) {
      // Dejamos que Ionic y Android manejen el espacio del footer automáticamente.
      // Al eliminar 'setOverlaysWebView', la app respetará los límites nativos y no invadirá los botones.
    }
  }
}