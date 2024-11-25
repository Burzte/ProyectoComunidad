import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoolPageRoutingModule } from './pool-routing.module';

import { PoolPage } from './pool.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoolPageRoutingModule,
    SharedModule
  ],
  declarations: [PoolPage]
})
export class PoolPageModule {}
