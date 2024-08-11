import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyValueListComponent } from '../admin/key-value-list/key-value-list.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { ApplicantAndStatusViewerComponent } from './components/applicant-and-status-viewer/applicant-and-status-viewer.component';
import { MaterialModule } from '../modules/material/material.module';
import { LandingComponent } from './landing/landing.component';
import { ReferralDialogComponent } from './referral-dialog/referral-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareIconsComponent } from './share-icons/share-icons.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';

const SHARED_COMPONENTS = [
  KeyValueListComponent,
  DocumentViewerComponent,
  ApplicantAndStatusViewerComponent,
  LandingComponent,
  ReferralDialogComponent,
  ShareIconsComponent,
  ForgotPasswordComponent,
  ScrollToTopComponent
]

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    ...SHARED_COMPONENTS
  ]
})
export class SharedModule { }
