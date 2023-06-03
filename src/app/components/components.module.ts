import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

import { MaterialModule } from '../material-module';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';
import { ComponentsRoutes } from './components.routing';
import { OrderConfirmQrComponent } from './order-confirm-qr/order-confirm-qr.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    NgxScannerQrcodeModule,
    RouterModule.forChild(ComponentsRoutes)
  ],
  declarations: [
    OrderConfirmComponent,
    OrderConfirmQrComponent
  ],
  providers: [
    CurrencyPipe,
  ]
})
export class ComponentsModule {}
