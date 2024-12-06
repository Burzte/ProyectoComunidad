import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pool-form-modal',
  templateUrl: './pool-form-modal.component.html',
  styleUrls: ['./pool-form-modal.component.scss'],
})
export class PoolFormModalComponent {
  registro: any = {
    residentes: [],
    visitas: [],
    pulserasVerdes: 0,
    pulserasCalipso: 0,
    departamento: '',  // Asegúrate de que esta propiedad esté definida
  };

  maxPulserasVerdes = 2;
  maxPulserasCalipso = 2;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  async registrar() {
    console.log('Datos del registro:', this.registro); // Ayuda para depurar
    this.modalController.dismiss(this.registro);
  }

  agregarResidente() {
    if (this.registro.residentes.length < this.maxPulserasVerdes) {
      this.registro.residentes.push({ nombre: '', rut: '' });
    } else {
      this.mostrarAlerta(
        'Límite excedido',
        'Solo se permiten 2 pulseras verdes para residentes.'
      );
    }
  }

  agregarVisita() {
    if (this.registro.visitas.length < this.maxPulserasCalipso) {
      this.registro.visitas.push({ nombre: '', rut: '' });
    } else {
      this.mostrarAlerta(
        'Límite excedido',
        'Solo se permiten 2 pulseras calipso para visitas.'
      );
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
