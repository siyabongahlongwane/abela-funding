import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferralsComponent } from '../components/admin/referrals/referrals.component';
import { AdminGuard } from '../guards/admin.guard';
import { ApplicationsComponent } from './applications/applications.component';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewApplicationComponent } from './view-application/view-application.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'admin/dashboard', pathMatch: 'full'
  }
  ,
  {
    path: 'admin', component: ContainerComponent, canActivate: [AdminGuard], children: [
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
      },
      {
        path: 'referrals', component: ReferralsComponent
      },
      // { path: '**', component: NotFoundComponent } // Wildcard route
    ]
  },
  // { path: '**', component: NotFoundComponent } // Wildcard route

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
