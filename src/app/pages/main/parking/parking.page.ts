import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ReservationPopoverComponent } from '../../../shared/components/reservation-popover/reservation-popover.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.page.html',
  styleUrls: ['./parking.page.scss'],
})
export class ParkingPage implements OnInit {
  estacionamientos: any[] = [];
  estacionamientosFiltrados: any[] = [];
  filtroNumero: string = '';
  role: string = '';
  userUID: string = '';

  constructor(private popoverCtrl: PopoverController, private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.getUserRole();
    this.cargarEstacionamientos();
  }

  // Obtener el rol del usuario
  async getUserRole() {
    const user = getAuth().currentUser;
    if (user) {
      this.userUID = user.uid;
      const userDoc = await this.firebaseService.getDocument(`users/${user.uid}`);
      this.role = userDoc?.['role'] || '';
    }
  }

  cargarEstacionamientos() {
    for (let i = 1; i <= 200; i++) {
      this.estacionamientos.push({
        id: i,
        estado: true,
        nombre: '',
        patente: '',
        departamento: '',
        tipoReserva: '',
      });
    }

    if (this.role === 'Residente') {
      this.estacionamientos = this.estacionamientos.filter(est => est.id >= 21 && est.id <= 200);
    } else if (this.role === 'Conserje') {
      this.estacionamientos = this.estacionamientos.filter(est => est.id >= 1 && est.id <= 20);
    }

    this.estacionamientosFiltrados = [...this.estacionamientos];
  }


  filtrarEstacionamientos() {
    const filtro = this.filtroNumero.trim().toLowerCase();
    if (filtro) {
      this.estacionamientosFiltrados = this.estacionamientos.filter(est =>
        est.id.toString().toLowerCase().includes(filtro)
      );
    } else {
      this.estacionamientosFiltrados = [...this.estacionamientos];
    }
  }

  async abrirPopover(estacionamiento: any) {
    if (this.role === 'Residente' && estacionamiento.id >= 21 && estacionamiento.id <= 200) {
      return;
    }

    if (this.role === 'Conserje' && estacionamiento.id >= 1 && estacionamiento.id <= 20) {
      const popover = await this.popoverCtrl.create({
        component: ReservationPopoverComponent,
        componentProps: { estacionamiento },
        translucent: true,
      });

      await popover.present();
    } else {
      return;
    }
  }

}
