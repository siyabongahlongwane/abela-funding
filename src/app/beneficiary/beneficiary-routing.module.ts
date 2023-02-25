import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewApplicationComponent } from '../admin/view-application/view-application.component';
import { ContainerComponent } from './container/container.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { NewApplicationComponent } from './new-application/new-application.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'abela/beneficiary/applications/my-applications', pathMatch: 'full'
  },
  {
    path: 'abela/beneficiary/applications', component: ContainerComponent, children: [
      {
        path: '', redirectTo: 'my-applications', pathMatch: 'full'
      },
      {
        path: 'my-applications', component: MyApplicationsComponent
      },
      {
        path: 'apply', component: NewApplicationComponent
      },
      {
        path: 'my-applications', component: MyApplicationsComponent
      },
      {
        path: 'view/:applicationId', component: ViewApplicationComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiaryRoutingModule { }
