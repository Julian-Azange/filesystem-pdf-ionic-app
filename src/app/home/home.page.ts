import { Component } from '@angular/core';
import { PDFDocument, rgb } from 'pdf-lib';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  name: string = '';
  lastname: string = '';
  idNumber: string = '';
  filePath: string = '';

  constructor() { }

  async generatePdf() {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const { width, height } = page.getSize();
      const fontSize = 30;

      page.drawText(`Nombre: ${this.name}`, {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Apellido: ${this.lastname}`, {
        x: 50,
        y: height - 5 * fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Cédula: ${this.idNumber}`, {
        x: 50,
        y: height - 6 * fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const base64Data = this.uint8ArrayToBase64(pdfBytes);

      const fileName = 'generated.pdf';
      const fileDirectory = Directory.Documents;

      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: fileDirectory
      });

      this.filePath = result.uri;

      this.mostrarToast('¡Archivo PDF descargado con éxito!');
    } catch (error) {
      console.error('Error al guardar el archivo PDF:', error);
      this.mostrarToast('Error al descargar el archivo PDF.');
    }
  }

  uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  }

  async mostrarToast(message: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    document.body.appendChild(toast);
    await toast.present();
  }
}
