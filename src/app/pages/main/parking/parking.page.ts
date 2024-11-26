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
  userUID: string = ''; // UID del usuario

  constructor(private popoverCtrl: PopoverController, private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.cargarEstacionamientos(); // Inicializamos todos los estacionamientos
    this.getUserRole(); // Obtenemos el rol del usuario
  }

  // Obtener el rol del usuario
  async getUserRole() {
    const user = getAuth().currentUser;
    if (user) {
      this.userUID = user.uid;
      const userDoc = await this.firebaseService.getDocument(`users/${user.uid}`);
      this.role = userDoc?.['role'] || ''; // Asignamos el rol del usuario
      console.log('Rol del usuario:', this.role);
    } else {
      console.error('No se pudo obtener el usuario autenticado.');
    }
  }

  // Cargar todos los estacionamientos (sin filtros)
  cargarEstacionamientos() {
    this.estacionamientos = Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      estado: true, // Disponible
      nombre: '',
      patente: '',
      departamento: '',
      tipoReserva: '',
    }));
    this.estacionamientosFiltrados = [...this.estacionamientos]; // Copia inicial
  }

  // Filtrar estacionamientos por número
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

  // Abrir popover para modificar un estacionamiento
  async abrirPopover(estacionamiento: any) {
    // Validar permisos para modificar según el rol y rango de estacionamientos
    if (
      (this.role === 'Conserje' && estacionamiento.id >= 1 && estacionamiento.id <= 20) ||
      (this.role === 'Residente' && estacionamiento.id >= 21 && estacionamiento.id <= 200)
    ) {
      const popover = await this.popoverCtrl.create({
        component: ReservationPopoverComponent,
        componentProps: { estacionamiento },
        translucent: true,
      });
      await popover.present();
    } else {
      console.warn('No tienes permisos para modificar este estacionamiento.');
      return; // No hacer nada si no tiene permisos
    }
  }
}

