import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthPageComponent } from './containers';
import { HomeComponent } from '../pages/home/home.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthPageComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
