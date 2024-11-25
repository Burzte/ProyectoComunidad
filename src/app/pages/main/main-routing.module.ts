import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'parking',
    loadChildren: () => import('./parking/parking.module').then( m => m.ParkingPageModule)
  },
  {
    path: 'pool',
    loadChildren: () => import('./pool/pool.module').then( m => m.PoolPageModule)
  },
  {
    path: 'delivery',
    loadChildren: () => import('./delivery/delivery.module').then( m => m.DeliveryPageModule)
  },
    ]
  },





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
