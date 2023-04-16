import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
  NgxScannerQrcodeService,
  ScannerQRCodeResult,
  NgxScannerQrcodeComponent
} from 'ngx-scanner-qrcode';
import { delay } from 'rxjs';

@Component({
  selector: 'app-order-confirm-qr',
  templateUrl: './order-confirm-qr.component.html',
  styleUrls: ['./order-confirm-qr.component.scss']
})
export class OrderConfirmQrComponent implements OnInit, OnDestroy {


  public config: ScannerQRCodeConfig = {
    // fps: 1000,
    vibrate: 400,
    isBeep: true,
    decode: 'utf-8',
    deviceActive: 1, // Camera 1 active
    constraints: {
      audio: false,
      video: {
        width: window.innerWidth
      }
    }
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];
  @ViewChild('action', { static: true }) action!: NgxScannerQrcodeComponent;

  // create form with validators and dynamic rows array
  formOrderConfirm: FormGroup = this.fb.group({
    order_id: ['', [Validators.required, Validators.minLength(1)]],
    type_cil_order: ['', [Validators.required, Validators.minLength(5)]],
    code_cil_order: ['', [Validators.required, Validators.minLength(2)]],
    qty_cil_order: [false, [Validators.required, Validators.minLength(1)]],
    qty_kg_order: ['', [Validators.max(0)]],
  });

  constructor(private qrcode: NgxScannerQrcodeService,
              public dialogQr: MatDialogRef<OrderConfirmQrComponent>,
              private fb: FormBuilder
              ) { }

  ngOnInit(): void {
    this.action.start();
  }

  ngOnDestroy(): void {
    this.action.stop()
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    if (e.length > 0) {
      this.action.stop()
      this.formOrderConfirm.controls.qty_kg_order.reset
      console.log(e);
    }
  }

  public handle(action: NgxScannerQrcodeComponent, fn: keyof NgxScannerQrcodeComponent): void {
    action[fn]().subscribe(console.log, alert);
  }
//listCamera: object
  switchCamera(): void {
    const cameraActive = this.action.deviceActive ?? 0;
    const lenCameraDevices = this.action.devices.value.length - 1;

    if (cameraActive > 0 && cameraActive <= lenCameraDevices) {
      this.action.deviceActive = cameraActive + 1;
      console.log(this.action.deviceActive)
    } else {
      this.action.deviceActive = 1;
      console.log(this.action.deviceActive)
    }
  }




  /*confirmDialogQr(): void {
    this.dialogQr.close()
  }

  rejectDialogQr(): void {
    this.dialogQr.close(false)
  }*/

}
