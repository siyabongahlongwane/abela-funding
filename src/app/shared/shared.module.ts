import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyValueListComponent } from '../admin/key-value-list/key-value-list.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';

const SHARED_COMPONENTS = [
  KeyValueListComponent,
  DocumentViewerComponent

]

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...SHARED_COMPONENTS
  ]
})
export class SharedModule { }
