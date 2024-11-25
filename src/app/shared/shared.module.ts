import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { ReservationPopoverComponent } from './components/reservation-popover/reservation-popover.component';
import { PoolFormModalComponent } from './components/pool-form-modal/pool-form-modal.component';
import { DeliveryFormModalComponent } from './components/delivery-form-modal/delivery-form-modal.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CustomInputComponent,
    ReservationPopoverComponent,
    PoolFormModalComponent,
    DeliveryFormModalComponent,
    EditProfileComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CustomInputComponent,
    ReservationPopoverComponent,
    PoolFormModalComponent,
    DeliveryFormModalComponent,
    EditProfileComponent,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
