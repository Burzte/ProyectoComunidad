import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PoolFormModalComponent } from '../../../shared/components/pool-form-modal/pool-form-modal.component';
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio de Firebase
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.page.html',
  styleUrls: ['./pool.page.scss'],
})
export class PoolPage implements OnInit {
  registros: any[] = [];
  role: string; // Variable para almacenar el rol del usuario

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private firebaseService: FirebaseService,
  ) {}

  ngOnInit() {
    this.getUserRole();
  }

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

  async abrirModal() {
    const modal = await this.modalController.create({
      component: PoolFormModalComponent,
    });

    modal.onDidDismiss().then(data => {
      if (data.data) {
        this.registrarAcceso(data.data);
      }
    });

    return await modal.present();
  }

  registrarAcceso(nuevoRegistro: any) {
    const { nombreResidente, rutResidente, departamento, nombreVisita, rutVisita, pulseras } = nuevoRegistro;

    const departamentoExistente = this.registros.find(reg => reg.departamento === departamento);

    if (departamentoExistente) {
      const totalVisitas = departamentoExistente.visitas.length;
      if (totalVisitas >= 2 && nombreVisita) {
        this.mostrarAlerta('Restricción', 'Solo se permiten dos visitas por departamento.');
        return;
      }
    }

    if (!departamentoExistente) {
      this.registros.push({
        departamento,
        nombreResidente,
        rutResidente,
        visitas: nombreVisita
          ? [{ nombre: nombreVisita, rut: rutVisita, color: 'Rojo' }]
          : [],
        totalPulseras: pulseras,
      });
    } else {
      if (nombreVisita) {
        departamentoExistente.visitas.push({ nombre: nombreVisita, rut: rutVisita, color: 'Rojo' });
      }
      departamentoExistente.totalPulseras += pulseras;
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
