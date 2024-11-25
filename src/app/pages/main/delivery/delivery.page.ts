import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeliveryFormModalComponent } from '../../../shared/components/delivery-form-modal/delivery-form-modal.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage {
  encomiendas: any[] = []; // Lista de encomiendas
  role: string = '';

  constructor(private modalController: ModalController, private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.getUserRole();
  }

  // Método para obtener el rol del usuario
  async getUserRole() {
    const user = getAuth().currentUser;
    if (user) {
      const userDoc = await this.firebaseService.getDocument(`users/${user.uid}`);
      this.role = userDoc?.['role'];  // Asignamos el rol obtenido
    }
  }

  // Método para verificar si el usuario tiene el rol de Conserje
  isConserje() {
    return this.role === 'Conserje';
  }

  // Método para verificar si el usuario tiene el rol de Residente
  isResidente() {
    return this.role === 'Residente';
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: DeliveryFormModalComponent,
    });

    modal.onDidDismiss().then(data => {
      if (data.data) {
        this.registrarEncomienda(data.data);
      }
    });

    return await modal.present();
  }

  registrarEncomienda(encomienda: any) {
    this.encomiendas.push(encomienda);
  }

  retirarEncomienda(encomienda: any) {
    this.encomiendas = this.encomiendas.filter(e => e !== encomienda);
  }
}
