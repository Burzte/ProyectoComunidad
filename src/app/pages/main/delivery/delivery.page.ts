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
export class DeliveryPage implements OnInit {
  encomiendas: any[] = [];
  role: string = '';

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.getUserRole();
    this.cargarEncomiendas(); // Cargar encomiendas desde Firebase
  }

  // Obtener rol del usuario actual
  async getUserRole() {
    const user = getAuth().currentUser;
    if (user) {
      const userDoc = await this.firebaseService.getDocument(`users/${user.uid}`);
      this.role = userDoc?.['role'];
    }
  }

  isConserje() {
    return this.role === 'Conserje';
  }

  isResidente() {
    return this.role === 'Residente';
  }

  // Abrir modal para registrar encomienda
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

  // Cargar encomiendas desde Firebase
  cargarEncomiendas() {
    this.firebaseService.getCollection('encomiendas').subscribe(data => {
      this.encomiendas = data.map(encomienda => {
        return {
          ...encomienda,
          id: encomienda.id || encomienda.doc?.id || 'id-no-disponible',
        };
      });
    });
  }

  // Registrar encomienda en Firebase
  async registrarEncomienda(encomienda: any) {
    try {
      // Verificar y manejar valores undefined
      encomienda = {
        ...encomienda,
        tamano: encomienda.tamano || '', // Proporcionar un valor por defecto si está undefined
      };

      const docRef = this.firebaseService.firestore.collection('encomiendas').doc();
      encomienda.id = docRef.ref.id; // Aquí usamos `ref.id` para obtener el ID generado automáticamente

      await this.firebaseService.addDeliveryDocument('encomiendas', encomienda.id, encomienda);
      this.encomiendas.push(encomienda); // Añadir a la lista local
    } catch (error) {
      console.error('Error al registrar encomienda:', error);
    }
  }

  // Retirar encomienda de Firebase
  async retirarEncomienda(encomienda: any) {
    try {
      if (!encomienda.id || encomienda.id === 'id-no-disponible') {
        console.error('Error: No se encontró el ID de la encomienda', encomienda);
        throw new Error('ID de encomienda no encontrado');
      }

      await this.firebaseService.deleteDeliveryDocument(`encomiendas/${encomienda.id}`);
      this.encomiendas = this.encomiendas.filter(e => e.id !== encomienda.id); // Eliminar de la lista local
    } catch (error) {
      console.error('Error al retirar encomienda:', error);
    }
  }
}
