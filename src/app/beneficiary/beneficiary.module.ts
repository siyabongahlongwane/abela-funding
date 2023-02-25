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


@NgModule({
  declarations: [
    NewApplicationComponent,
    ContainerComponent,
    DashboardComponent,
    NavbarComponent,
    MyApplicationsComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    BeneficiaryRoutingModule,
    MaterialModule,
    MaterialModule,
    ChartsModule,
    ReactiveFormsModule
  ]
})
export class BeneficiaryModule { }
