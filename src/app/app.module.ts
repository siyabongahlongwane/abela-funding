import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminModule } from './admin/admin.module';
import { ChartsModule} from 'ng2-charts';
import { AuthModule } from './auth/auth.module';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';
import { MaterialModule } from './modules/material/material.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { ReferralsComponent } from './components/admin/referrals/referrals.component';

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
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
