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
      const updatedEstacionamiento = {
        ...this.estacionamiento,
        estado: false,
        nombre: this.nombre,
        patente: this.patente,
        departamento: this.departamento,
        tipoReserva: this.tipoReserva,
      };
      this.popoverCtrl.dismiss(updatedEstacionamiento, 'confirm');
    }
  }

  liberar() {
    const updatedEstacionamiento = {
      ...this.estacionamiento,
      estado: true,
      nombre: null,
      patente: null,
      departamento: null,
      tipoReserva: null,
    };
    this.popoverCtrl.dismiss(updatedEstacionamiento, 'confirm');
  }
}
