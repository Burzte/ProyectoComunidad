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
  estacionamientos: any[] = []; // Lista completa de estacionamientos
  estacionamientosFiltrados: any[] = []; // Lista filtrada
  filtroNumero: string = ''; // Valor del filtro
  role: string = ''; // Rol del usuario
  userUID: string = ''; // UID del usuario para los residentes

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
      this.role = userDoc?.['role'] || '';  // Asignamos el rol del usuario
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

    // Si el usuario es residente, solo se cargan los estacionamientos que le corresponden
    if (this.role === 'Residente') {
      this.estacionamientos = this.estacionamientos.filter(est => est.id === 30);  // Asumimos que el residente tiene asignado el estacionamiento 30
    } else if (this.role === 'Conserje') {
      // El conserje puede modificar los estacionamientos del 1 al 20
      this.estacionamientos = this.estacionamientos.filter(est => est.id >= 1 && est.id <= 20);
    }

    this.estacionamientosFiltrados = [...this.estacionamientos]; // Copia inicial
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
    // Solo los residentes pueden modificar su estacionamiento asignado
    if (this.role === 'Residente' && estacionamiento.id !== 30) {
      return; // No permitir la modificación de otros estacionamientos
    }

    // El conserje puede modificar los estacionamientos 1-20
    if (this.role === 'Conserje' && estacionamiento.id >= 1 && estacionamiento.id <= 20) {
      const popover = await this.popoverCtrl.create({
        component: ReservationPopoverComponent,
        componentProps: { estacionamiento },
        translucent: true,
      });

      await popover.present();
    } else {
      // Si no es un residente o conserje autorizado, no hacer nada
      return;
    }
  }

}
