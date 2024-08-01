import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiaryRoutingModule } from './beneficiary-routing.module';
import { NewApplicationComponent } from './new-application/new-application.component';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../modules/material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { ProfileComponent } from './profile/profile.component';
import { DocumentsUploadComponent } from './documents-upload/documents-upload.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    NewApplicationComponent,
    ContainerComponent,
    DashboardComponent,
    NavbarComponent,
    MyApplicationsComponent,
    ProfileComponent,
    DocumentsUploadComponent
  ],
  imports: [
    CommonModule,
    BeneficiaryRoutingModule,
    MaterialModule,
    MaterialModule,
    ChartsModule,
    ReactiveFormsModule,
    PdfViewerModule
  ]
})
export class BeneficiaryModule { }
