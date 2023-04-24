import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
  NgxScannerQrcodeService,
  ScannerQRCodeResult,
  NgxScannerQrcodeComponent
} from 'ngx-scanner-qrcode';
import { IOrderDetailsModel } from 'src/app/shared/model/orderDetails.model';
import { IQrDetailsModel } from 'src/app/shared/model/qrDetails.model';

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
  isQrForm!: boolean;
  private confirmOrderDetial: IOrderDetailsModel[] = []

  // create form with validators and dynamic rows array
  formOrderConfirm: FormGroup = this.fb.group({
    order_id: [0, [Validators.required]],
    type_cil_order: ['', [Validators.required]],
    code_cil_order: ['', [Validators.required]],
    qty_cil_order: [1, [Validators.required]],
    tara_cil_order: ['', [Validators.required]],
    qty_kg_order: ['', [Validators.required, Validators.min(0)]],
  });

  constructor(private qrcode: NgxScannerQrcodeService,
              public dialogQr: MatDialogRef<OrderConfirmQrComponent>,
              @Inject(MAT_DIALOG_DATA) private validFormQr: boolean,
              private fb: FormBuilder
              ) { }

  ngOnInit(): void {
    this.isQrForm = this.validFormQr;
    this.formOrderConfirm.controls.type_cil_order.disable();
    this.formOrderConfirm.controls.code_cil_order.disable();

      if (this.isQrForm) {
        this.action.start();
      }
  }

  ngOnDestroy(): void {
    this.action.stop()
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    if (e.length > 0) {
      this.action.stop()
      const dataQr: IQrDetailsModel = JSON.parse(e[0].value)
      this.formOrderConfirm.patchValue({
        order_id: 1,
        type_cil_order: dataQr.referencia,
        code_cil_order: dataQr.codigo,
        qty_cil_order: "1",
        tara_cil_order: dataQr.tara
      });
    }
  }

  nextScanQr(): void {
    if(this.formOrderConfirm.valid) {
      const newScan: IOrderDetailsModel = {
        id_detail: this.formOrderConfirm.controls.order_id.value,
        code_cil_order: this.formOrderConfirm.controls.code_cil_order.value,
        type_cil_order: this.formOrderConfirm.controls.type_cil_order.value,
        tara_cil_order: this.formOrderConfirm.controls.tara_cil_order.value,
        qty_cil_order: this.formOrderConfirm.controls.qty_cil_order.value,
        kg_cil_order: this.formOrderConfirm.controls.qty_kg_order.value
      }
      this.confirmOrderDetial.push(newScan);
      this.formOrderConfirm.reset();
    }
    this.action.start();

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
    } else {
      this.action.deviceActive = 1;
    }
  }

  confirmDialogQr(): void {
    this.dialogQr.close(this.confirmOrderDetial);
  }

  rejectDialogQr(): void {
    this.dialogQr.close(this.confirmOrderDetial);
  }

}
