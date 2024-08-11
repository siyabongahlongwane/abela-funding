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

const SHARED_COMPONENTS = [
  KeyValueListComponent,
  DocumentViewerComponent,
  ApplicantAndStatusViewerComponent,
  LandingComponent,
  ReferralDialogComponent,
  ShareIconsComponent
]

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    ...SHARED_COMPONENTS
  ]
})
export class SharedModule { }
