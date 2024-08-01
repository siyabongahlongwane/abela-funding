import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewApplicationComponent } from '../admin/view-application/view-application.component';
import { BeneficiaryGuard } from '../guards/beneficiary.guard';
import { ContainerComponent } from './container/container.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { NewApplicationComponent } from './new-application/new-application.component';
import { ProfileComponent } from './profile/profile.component';
import { DocumentsUploadComponent } from './documents-upload/documents-upload.component';

const routes: Routes = [
  {
    path: 'abela/beneficiary', component: ContainerComponent, canActivate: [BeneficiaryGuard], children: [
      {
        path: '', redirectTo: 'applications/my-applications', pathMatch: 'full'
      },
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'applications', children: [
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
          },
          {
            path: 'upload-documents/:applicationId', component: DocumentsUploadComponent
          }
        ]
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiaryRoutingModule { }
