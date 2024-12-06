import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ReservationPopoverComponent } from '../../../shared/components/reservation-popover/reservation-popover.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Estacionamiento } from '../../../models/estacionamiento.model';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.page.html',
  styleUrls: ['./parking.page.scss'],
})
export class ParkingPage implements OnInit {
  estacionamientos: Estacionamiento[] = [];
  estacionamientosFiltrados: Estacionamiento[] = [];
  filtroNumero: string = '';
  role: string = '';
  userUID: string = '';

  constructor(private popoverCtrl: PopoverController, private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.getUserRole();
    this.cargarEstacionamientosDesdeFirebase();
  }

  // Obtener datos del usuario y su rol
  private async getUserRole() {
    const user = getAuth().currentUser;
    if (user) {
      this.userUID = user.uid;
      const userDoc = await this.firebaseService.getDocument(`users/${user.uid}`);
      this.role = userDoc?.['role'] || '';
      console.log('Rol del usuario:', this.role);
    } else {
      console.error('No se pudo obtener el usuario autenticado.');
    }
  }

  // Cargar estacionamientos desde Firestore
  cargarEstacionamientosDesdeFirebase() {
    this.firebaseService.getCollection('estacionamientos').subscribe((data: Estacionamiento[]) => {
      this.estacionamientos = data.sort((a, b) => a.id - b.id);
      this.estacionamientosFiltrados = [...this.estacionamientos];
    });
  }

  // Filtrar estacionamientos por número
  filtrarEstacionamientos() {
    const filtro = this.filtroNumero.trim().toLowerCase();
    this.estacionamientosFiltrados = filtro
      ? this.estacionamientos.filter(est =>
          est.id.toString().toLowerCase().includes(filtro)
        )
      : [...this.estacionamientos];
  }

  // Validar permisos para modificar un estacionamiento
  private tienePermiso(estacionamiento: Estacionamiento): boolean {
    if (this.role === 'Conserje') {
      return estacionamiento.id >= 1 && estacionamiento.id <= 20; // Conserje: 1 al 20
    }
    if (this.role === 'Residente') {
      return estacionamiento.id >= 21 && estacionamiento.id <= 200; // Residente: 21 al 200
    }
    return false; // Cualquier otro rol no tiene permisos
  }

  // Abrir popover para modificar un estacionamiento
  async abrirPopover(estacionamiento: Estacionamiento) {
    if (!this.tienePermiso(estacionamiento)) {
      const mensaje =
        this.role === 'Conserje'
          ? 'No tienes permiso para modificar estacionamientos del 21 al 200.'
          : 'No tienes permiso para modificar estacionamientos del 1 al 20.';
      console.warn(mensaje);

      const toast = document.createElement('ion-toast');
      toast.message = mensaje;
      toast.duration = 3000;
      toast.color = 'danger';
      toast.position = 'middle';

      document.body.appendChild(toast);
      await toast.present();

      return;
    }

    const popover = await this.popoverCtrl.create({
      component: ReservationPopoverComponent,
      componentProps: { estacionamiento },
      translucent: true,
      cssClass:'full-width-popover',
    });

    await popover.present();

    const { data, role } = await popover.onDidDismiss();
    if (role === 'confirm' && data) {
      try {
        const updatedEstacionamiento = { ...data };
        await this.firebaseService.addParkingDocument(
          'estacionamientos',
          updatedEstacionamiento.id.toString(),
          updatedEstacionamiento
        );
        this.estacionamientos = this.estacionamientos.map(est =>
          est.id === updatedEstacionamiento.id ? updatedEstacionamiento : est
        );
        this.filtrarEstacionamientos();
        console.log('Estacionamiento actualizado correctamente.');
      } catch (error) {
        console.error('Error al actualizar el estacionamiento:', error);
      }
    }
  }
}
