import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-delivery-form-modal',
  templateUrl: './delivery-form-modal.component.html',
  styleUrls: ['./delivery-form-modal.component.scss'],
})
export class DeliveryFormModalComponent {
  nuevaEncomienda = {
    empaque: '',
    tamano: '',
    empresa: '',
    nombreDestinatario: '',
    departamento: '',
  };

  constructor(private modalController: ModalController) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  registrar() {
    this.modalController.dismiss(this.nuevaEncomienda);
  }
}
