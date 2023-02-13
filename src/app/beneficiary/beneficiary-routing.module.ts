import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewApplicationComponent } from './new-application/new-application.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'abela/beneficiary/dashboard', pathMatch: 'full'
  }
  ,
  {
    path: 'abela/beneficiary', component: ContainerComponent, children: [
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'applications/:applicationType', component: NewApplicationComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiaryRoutingModule { }
