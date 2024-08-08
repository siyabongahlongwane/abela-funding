import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './shared/landing/landing.component';

const routes: Routes = [
  {
    path: '', component: LandingComponent
  },
  {
    path: 'auth', // path to the feature module
    loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: 'beneficiary', // path to the feature module
    loadChildren: () => import('./beneficiary/beneficiary-routing.module').then(m => m.BeneficiaryRoutingModule)
  },
  {
    path: 'admin', // path to the feature module
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
