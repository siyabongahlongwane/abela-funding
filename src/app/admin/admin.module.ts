import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContainerComponent } from './container/container.component';
import { MaterialModule } from '../modules/material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ChartsModule } from 'ng2-charts';
import { ViewApplicationComponent } from './view-application/view-application.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    ContainerComponent,
    NavbarComponent,
    ApplicationsComponent,
    ViewApplicationComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ChartsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
