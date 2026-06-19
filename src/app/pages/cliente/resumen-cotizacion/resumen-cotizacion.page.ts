import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
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

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

import { CotizacionService } from '../../../services/cotizacion.service';
import { Cotizacion } from '../../../models/cotizacion.model';

@Component({
  selector: 'app-resumen-cotizacion',
  templateUrl: './resumen-cotizacion.page.html',
  styleUrls: ['./resumen-cotizacion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, DecimalPipe,
    IonContent, IonHeader, IonToolbar, IonTitle,
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cotizacion = this.cotizacionService.getById(id);
    }
    if (!this.cotizacion) {
      this.router.navigate(['/cotizacion/historial']);
    }
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  async compartir() {
    if (!this.cotizacion) return;

    const texto = this.buildTextoCompartir();

    if (navigator.share) {
      await navigator.share({
        title: `Cotización ${this.cotizacion.id}`,
        text: texto
      });
    } else {
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

  private cargarImagenLogo(url: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  }

  async guardarPdf() {
    if (!this.cotizacion) return;

    const loading = await this.loadingCtrl.create({
      message: 'Diseñando documento ejecutivo...'
    });
    await loading.present();

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 18;
      let yPos = 20;

      const c = this.cotizacion;

      // 1. Logotipo Corporativo
      const logoImg = await this.cargarImagenLogo('assets/logo-ksk.png');
      if (logoImg) {
        pdf.addImage(logoImg, 'PNG', -3, yPos - 18, 50, 50);
      }

      // Información de Empresa
      pdf.setTextColor(26, 26, 26);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Corporación KSK S.A.C.', margin + 18, yPos + 4);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(107, 114, 128);
      pdf.text('Comercio e Importaciones de Alta Eficiencia', margin + 18, yPos + 9);

      // Bloque de Identificación del Documento (Lado Derecho Superior)
      // ── CORRECCIÓN AQUÍ: Se eliminó la línea con error ──
      pdf.setTextColor(46, 207, 179); // Cyan KSK
      pdf.setFontSize(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text(c.id, pageWidth - margin, yPos + 4, { align: 'right' });

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Fecha: ${this.formatDate(c.fecha)}`, pageWidth - margin, yPos + 9, { align: 'right' });

      // Línea divisoria elegante en Cyan KSK
      yPos += 18;
      pdf.setDrawColor(46, 207, 179);
      pdf.setLineWidth(0.6);
      pdf.line(margin, yPos, pageWidth - margin, yPos);

      // 2. Bloque de Datos del Cliente
      yPos += 10;
      pdf.setFillColor(249, 250, 251); 
      pdf.setDrawColor(235, 237, 240);
      pdf.setLineWidth(0.2);
      pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 22, 3, 3, 'FD');

      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DOCUMENTO DE PRE-VENTA DESTINADO A:', margin + 5, yPos + 5);

      pdf.setTextColor(26, 26, 26);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(c.cliente.nombre, margin + 5, yPos + 11);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99);
      pdf.text(`Teléfono de contacto: ${c.cliente.telefono || 'No especificado'}`, margin + 5, yPos + 16);

      // 3. Tabla de Productos
      yPos += 32;
      pdf.setTextColor(26, 26, 26);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DESGLOSE DE ARTÍCULOS COTIZADOS', margin, yPos);

      yPos += 5;
      pdf.setFillColor(243, 244, 246);
      pdf.rect(margin, yPos, pageWidth - (margin * 2), 7, 'F');
      
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(75, 85, 99);
      pdf.text('Descripción del Producto', margin + 3, yPos + 4.5);
      pdf.text('Cant.', pageWidth - margin - 42, yPos + 4.5, { align: 'right' });
      pdf.text('P. Unitario', pageWidth - margin - 22, yPos + 4.5, { align: 'right' });
      pdf.text('Subtotal', pageWidth - margin - 3, yPos + 4.5, { align: 'right' });

      yPos += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(26, 26, 26);

      c.items.forEach((item) => {
        const lineasNombre = pdf.splitTextToSize(item.nombre, 95);
        const factorAltura = 5;

        lineasNombre.forEach((linea: string, index: number) => {
          pdf.text(linea, margin + 3, yPos + 4);
          
          if (index === 0) {
            pdf.text(item.cantidad.toString(), pageWidth - margin - 42, yPos + 4, { align: 'right' });
            pdf.text(`S/ ${item.precio.toFixed(2)}`, pageWidth - margin - 22, yPos + 4, { align: 'right' });
            pdf.text(`S/ ${item.subtotal.toFixed(2)}`, pageWidth - margin - 3, yPos + 4, { align: 'right' });
          }
          yPos += factorAltura;
        });

        pdf.setDrawColor(243, 244, 246);
        pdf.setLineWidth(0.1);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += 2;
      });

      // 4. Sección de Cuadre Financiero
      yPos += 5;
      const xTotalesLabel = pageWidth - margin - 45;
      const xTotalesValor = pageWidth - margin - 3;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(107, 114, 128);
      pdf.text('Subtotal:', xTotalesLabel, yPos);
      pdf.setTextColor(26, 26, 26);
      pdf.text(`S/ ${c.subtotal.toFixed(2)}`, xTotalesValor, yPos, { align: 'right' });

      yPos += 5.5;
      pdf.setTextColor(107, 114, 128);
      pdf.text('IGV (18%):', xTotalesLabel, yPos);
      pdf.setTextColor(26, 26, 26);
      pdf.text(`S/ ${c.igv.toFixed(2)}`, xTotalesValor, yPos, { align: 'right' });

      yPos += 4;
      pdf.setFillColor(46, 207, 179); // Sólido Cyan KSK
      pdf.rect(pageWidth - margin - 65, yPos, 65, 8.5, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('TOTAL NETO:', pageWidth - margin - 61, yPos + 5.5);
      pdf.setFontSize(11);
      pdf.text(`S/ ${c.total.toFixed(2)}`, xTotalesValor, yPos + 5.5, { align: 'right' });

      yPos += 20;
      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Términos y condiciones:', margin, yPos);
      pdf.text('• Los precios indicados incluyen IGV. Precios sujetos a variaciones de stock de importación.', margin, yPos + 3.5);
      pdf.text('• Esta cotización constituye un documento informativo de pre-venta, mas no un comprobante de pago.', margin, yPos + 7);

      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(7.5);
      pdf.text(
        `Documento electrónico generado mediante la App Corporativa KSK el ${new Date().toLocaleString('es-PE')}`,
        pageWidth / 2,
        pageHeight - 12,
        { align: 'center' }
      );

      const nombreArchivo = `Cotizacion-${c.id}.pdf`;

      if (Capacitor.isNativePlatform()) {
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        const resultado = await Filesystem.writeFile({
          path: nombreArchivo,
          data: pdfBase64,
          directory: Directory.Cache
        });

        await loading.dismiss();

        await Share.share({
          title: `Cotización ${c.id}`,
          text: `Le enviamos el archivo PDF de la cotización ${c.id} - Corporación KSK`,
          url: resultado.uri,
          dialogTitle: 'Compartir cotización con el cliente'
        });
      } else {
        const blob = pdf.output('blob');
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = nombreArchivo;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        await loading.dismiss();
      }

      const toast = await this.toastCtrl.create({
        message: 'PDF diseñado y exportado con éxito',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Error al diseñar el PDF corporativo',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
      console.error('Error PDF Premium:', error);
    }
  }
}