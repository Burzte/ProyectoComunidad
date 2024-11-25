import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-reservation-popover',
  templateUrl: './reservation-popover.component.html',
  styleUrls: ['./reservation-popover.component.scss'],
})
export class ReservationPopoverComponent {
  @Input() estacionamiento: any;
  nombre: string = '';
  patente: string = '';
  departamento: string = '';
  tipoReserva: string = 'Residente'; // Por defecto

  constructor(private popoverCtrl: PopoverController) {}

  reservar() {
    if (this.nombre && this.patente && this.departamento && this.tipoReserva) {
      this.estacionamiento.estado = false;
      this.estacionamiento.nombre = this.nombre;
      this.estacionamiento.patente = this.patente;
      this.estacionamiento.departamento = this.departamento;
      this.estacionamiento.tipoReserva = this.tipoReserva;
      this.popoverCtrl.dismiss({ updated: true });
    }
  }

  liberar() {
    this.estacionamiento.estado = true;
    this.estacionamiento.nombre = null;
    this.estacionamiento.patente = null;
    this.estacionamiento.departamento = null;
    this.estacionamiento.tipoReserva = null;
    this.popoverCtrl.dismiss({ updated: true });
  }
}
