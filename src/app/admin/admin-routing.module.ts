import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/abela/admin', pathMatch: 'full'
  }
  ,
  {
    path: 'abela', component: ContainerComponent, children: [
      {
        path: 'admin', component: ContainerComponent
      },
      {
        path: 'dashboard', component: DashboardComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
