import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoolPage } from './pool.page';

const routes: Routes = [
  {
    path: '',
    component: PoolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolPageRoutingModule {}
