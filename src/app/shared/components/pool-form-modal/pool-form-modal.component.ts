import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pool-form-modal',
  templateUrl: './pool-form-modal.component.html',
  styleUrls: ['./pool-form-modal.component.scss'],
})
export class PoolFormModalComponent {
  nuevoRegistro = {
    nombreResidente: '',
    rutResidente: '',
    departamento: '',
    nombreVisita: '',
    rutVisita: '',
    pulseras: 0,
  };

  constructor(private modalController: ModalController) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  registrar() {
    this.modalController.dismiss(this.nuevoRegistro);
  }
}
