import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar,
  IonIcon, IonButtons, IonBackButton,
  ToastController, LoadingController
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import jsPDF from 'jspdf';
import {
  personOutline, callOutline, cubeOutline,
  shareSocialOutline, documentTextOutline, arrowBackOutline
} from 'ionicons/icons';

import { CotizacionService } from '../../services/cotizacion.service';
import { Cotizacion } from '../../models/cotizacion.model';

@Component({
  selector: 'app-resumen-cotizacion',
  templateUrl: './resumen-cotizacion.page.html',
  styleUrls: ['./resumen-cotizacion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, DecimalPipe,
    IonContent, IonHeader, IonToolbar,
    IonIcon, IonButtons, IonBackButton
  ]
})
export class ResumenCotizacionPage implements OnInit {

  cotizacion: Cotizacion | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cotizacionService: CotizacionService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      personOutline, callOutline, cubeOutline,
      shareSocialOutline, documentTextOutline, arrowBackOutline
    });
  }

  ngOnInit() {
    // Lee el ID de la URL: /cotizacion/resumen/COT-00025
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cotizacion = this.cotizacionService.getById(id);
    }
    // Si no existe el ID, regresa al historial
    if (!this.cotizacion) {
      this.router.navigate(['/cotizacion/historial']);
    }
  }

  // Formatea la fecha ISO a "20 may 2026"
  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // Compartir — usa la Web Share API nativa del dispositivo
  async compartir() {
    if (!this.cotizacion) return;

    const texto = this.buildTextoCompartir();

    // navigator.share funciona en Android/iOS con Capacitor
    if (navigator.share) {
      await navigator.share({
        title: `Cotización ${this.cotizacion.id}`,
        text: texto
      });
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(texto);
      const toast = await this.toastCtrl.create({
        message: 'Cotización copiada al portapapeles',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  // Construye el texto plano de la cotización para compartir
  private buildTextoCompartir(): string {
    if (!this.cotizacion) return '';
    const c = this.cotizacion;
    const items = c.items
      .map(i => `• ${i.nombre} x${i.cantidad} = S/ ${i.subtotal.toFixed(2)}`)
      .join('\n');

    return `
CORPORACIÓN KSK S.A.C.
${c.id} - ${this.formatDate(c.fecha)}

Cliente: ${c.cliente.nombre}
Tel: ${c.cliente.telefono}

PRODUCTOS:
${items}

Subtotal: S/ ${c.subtotal.toFixed(2)}
IGV (18%): S/ ${c.igv.toFixed(2)}
TOTAL: S/ ${c.total.toFixed(2)}
    `.trim();
  }

  // ── Generar PDF con jsPDF ──────────────────────────────
  async guardarPdf() {
    if (!this.cotizacion) return;

    const loading = await this.loadingCtrl.create({
      message: 'Generando PDF...',
      duration: 2000
    });
    await loading.present();

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      const c = this.cotizacion;

      // ── Header: KSK + Número ────────────────────────────
      pdf.setFillColor(46, 158, 101);
      pdf.rect(0, 0, pageWidth, 35, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('', 'bold');
      pdf.text('KSK', margin, 20);

      pdf.setFontSize(10);
      pdf.setFont('', 'normal');
      pdf.text('Corporación KSK S.A.C.', margin, 26);
      pdf.text('Comercio e Importaciones', margin, 31);

      pdf.setFontSize(14);
      pdf.setFont('', 'bold');
      pdf.text(c.id, pageWidth - margin - 50, 20);

      pdf.setFontSize(9);
      pdf.setFont('', 'normal');
      pdf.text(this.formatDate(c.fecha), pageWidth - margin - 50, 27);

      pdf.setTextColor(0, 0, 0);
      yPos = 45;

      // ── Cliente ──────────────────────────────────────────
      pdf.setFontSize(10);
      pdf.setFont('', 'bold');
      pdf.text('CLIENTE', margin, yPos);

      yPos += 6;
      pdf.setFontSize(11);
      pdf.setFont('', 'bold');
      pdf.text(c.cliente.nombre, margin, yPos);

      yPos += 5;
      pdf.setFontSize(9);
      pdf.setFont('', 'normal');
      pdf.text(`Teléfono: ${c.cliente.telefono || 'No disponible'}`, margin, yPos);

      yPos += 12;

      // ── Tabla de productos ───────────────────────────────
      pdf.setFontSize(10);
      pdf.setFont('', 'bold');
      pdf.text('PRODUCTOS', margin, yPos);

      yPos += 6;

      pdf.setFontSize(9);
      pdf.setFont('', 'bold');
      pdf.setFillColor(240, 249, 244);
      const headerY = yPos;
      pdf.rect(margin, headerY - 4, pageWidth - 2 * margin, 6, 'F');
      pdf.text('Descripción', margin + 2, headerY);
      pdf.text('Cant.', pageWidth - margin - 40, headerY);
      pdf.text('P.U.', pageWidth - margin - 25, headerY);
      pdf.text('Total', pageWidth - margin - 10, headerY);

      yPos += 7;

      pdf.setFont('', 'normal');
      pdf.setFontSize(9);
      c.items.forEach((item) => {
        const desc = pdf.splitTextToSize(item.nombre, 70);
        const lineHeight = 4;

        desc.forEach((line: string, i: number) => {
          pdf.text(line, margin + 2, yPos);
          if (i === 0) {
            pdf.text(item.cantidad.toString(), pageWidth - margin - 40, yPos);
            pdf.text(`S/ ${item.precio.toFixed(2)}`, pageWidth - margin - 25, yPos);
            pdf.text(`S/ ${item.subtotal.toFixed(2)}`, pageWidth - margin - 10, yPos);
          }
          yPos += lineHeight;
        });
        yPos += 2;
      });

      yPos += 3;

      // ── Totales ──────────────────────────────────────────
      pdf.setFillColor(242, 244, 246);
      pdf.rect(margin, yPos, pageWidth - 2 * margin, 5, 'F');

      pdf.setFont('', 'normal');
      pdf.setFontSize(9);
      pdf.text('Subtotal:', pageWidth - margin - 50, yPos + 3.5);
      pdf.text(`S/ ${c.subtotal.toFixed(2)}`, pageWidth - margin - 10, yPos + 3.5);

      yPos += 6;
      pdf.text('IGV (18%):', pageWidth - margin - 50, yPos);
      pdf.text(`S/ ${c.igv.toFixed(2)}`, pageWidth - margin - 10, yPos);

      yPos += 6;
      pdf.setFillColor(46, 158, 101);
      pdf.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('', 'bold');
      pdf.setFontSize(12);
      pdf.text('TOTAL:', pageWidth - margin - 50, yPos + 4.5);
      pdf.text(`S/ ${c.total.toFixed(2)}`, pageWidth - margin - 10, yPos + 4.5);

      // ── Pie de página ────────────────────────────────────
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.text(
        `Generado el ${new Date().toLocaleString('es-PE')}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      pdf.save(`Cotizacion-${c.id}.pdf`);

      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        message: 'PDF generado correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Error al generar el PDF',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
      console.error('Error PDF:', error);
    }
  }
}