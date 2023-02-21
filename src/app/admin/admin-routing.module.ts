import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './applications/applications.component';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewApplicationComponent } from './view-application/view-application.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'abela/admin/dashboard', pathMatch: 'full'
  }
  ,
  {
    path: 'abela/admin', component: ContainerComponent, children: [
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'applications/view/:applicationId', component: ViewApplicationComponent
      },
      {
        path: 'applications/:applicationType', component: ApplicationsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
