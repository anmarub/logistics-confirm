import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
  NgxScannerQrcodeService,
  ScannerQRCodeResult,
  NgxScannerQrcodeComponent
} from 'ngx-scanner-qrcode';
import { IOrderDetailsModel } from 'src/app/shared/model/orderDetails.model';
import { IOrderDetailsConfirmModel } from 'src/app/shared/model/orderDetailsConfirm.model';
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
      facingMode: "environment",
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
  typeScan!: boolean;
  duplicateNIF: boolean = true;
  private confirmOrderDetail: IOrderDetailsConfirmModel[] = []

  // create form with validators and dynamic rows array
  formOrderConfirm: FormGroup = this.fb.group({
    order_id: [0, [Validators.required]],
    type_cil_order: [null, [Validators.required]],
    code_cil_order: [null, [Validators.required]],
    qty_cil_order: [1, [Validators.required]],
    tara_cil_order: [0, [Validators.required]],
    qty_kg_order: ['', [Validators.required, Validators.min(0)]],
    type_move: [true, [Validators.required]]
  });

  constructor(private qrcode: NgxScannerQrcodeService,
              private snackBar: MatSnackBar,
              public dialogQr: MatDialogRef<OrderConfirmQrComponent>,
              @Inject(MAT_DIALOG_DATA) private validFormQr: boolean,
              private fb: FormBuilder
              ) { }

  ngOnInit(): void {
    this.isQrForm = this.validFormQr;

      if (this.isQrForm) {
        this.action.start();
      }
  }

  ngOnDestroy(): void {
    this.action.stop()
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    if (e.length > 0) {
      this.action.pause()
      const dataQr: IQrDetailsModel = JSON.parse(e[0].value)
      const statusNIF = this.validNIFItem(dataQr.codigo)
      if (statusNIF) {
        this.formOrderConfirm.patchValue({
          order_id: 1,
          type_cil_order: dataQr.referencia,
          code_cil_order: dataQr.codigo,
          qty_cil_order: 1,
          tara_cil_order: dataQr.tara
        });
      } else {
        this.showSnackbarCssStyles('Error: El codigo NIF del Cilindro esta duplicado, Valide e intente nuevamente','Close',4000)
      }
    }
    console.log(this.duplicateNIF);
  }

  nextScanQr(isCloseWindow:boolean): void {

    const code_cil_confirm = this.formOrderConfirm.controls.code_cil_order.value

    if(this.formOrderConfirm.valid && this.validNIFItem(code_cil_confirm)) {
      const newScan: IOrderDetailsConfirmModel = {
        order_id: this.formOrderConfirm.controls.order_id.value,
        code_cil_confirm: code_cil_confirm,
        type_cil_confirm: this.formOrderConfirm.controls.type_cil_order.value,
        qty_cil_confirm: this.formOrderConfirm.controls.qty_cil_order.value,
        kg_cil_confirm: this.formOrderConfirm.controls.qty_kg_order.value,
        type_move: this.formOrderConfirm.controls.type_move.value,
        tara_cil_confirm: this.formOrderConfirm.controls.tara_cil_order.value
      }
      console.log(newScan);
      this.confirmOrderDetail.push(newScan);
      this.formOrderConfirm.reset({
        orderConfirm_id: '',
        type_cil_confirm: '',
        tara_cil_confirm: '',
        kg_cil_Confirm: '',
        type_move: this.formOrderConfirm.controls.type_move.value
      });
    }
    console.log(this.formOrderConfirm.controls.value);

    if(isCloseWindow) {
      this.closeDialogQr();
    } else {
      this.action.play();
    }
  }

  validNIFItem(id_nif: string): boolean {
    return this.confirmOrderDetail.filter(item => item.code_cil_confirm == id_nif).length === 0 ? true : false
  }

  showSnackbarCssStyles(content: string, action: string, duration: number) {
    let sb = this.snackBar.open(content, action, {
      duration: duration,
      panelClass: ["custom-style"]
    });
    sb.onAction().subscribe(() => {
      sb.dismiss();
    });
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
    this.dialogQr.close(this.confirmOrderDetail);
  }

  closeDialogQr(): void {
    this.dialogQr.close(this.confirmOrderDetail);
  }

}
