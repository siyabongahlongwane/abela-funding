import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminModule } from './admin/admin.module';
import { ChartsModule } from 'ng2-charts';
import { AuthModule } from './auth/auth.module';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';
import { MaterialModule } from './modules/material/material.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { ReferralsComponent } from './components/admin/referrals/referrals.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { NetworkInterceptor } from './interceptors/network.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmPopupComponent,
    ReferralsComponent  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AdminModule,
    AuthModule,
    BeneficiaryModule,
    ChartsModule,
    MaterialModule,
    HttpClientModule,
    PdfViewerModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: NetworkInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})

export class AppModule { }
