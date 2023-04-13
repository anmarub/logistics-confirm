import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
    // decode: 'macintosh',
    deviceActive: 0, // Camera 1 active
    constraints: {
      audio: false,
      video: {
        width: window.innerWidth
      }
    }
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  constructor(private qrcode: NgxScannerQrcodeService,
              public dialogQr: MatDialogRef<OrderConfirmQrComponent>,
              ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    console.log(e)
    console.log(e);
  }

  public handle(action: NgxScannerQrcodeComponent, fn: keyof NgxScannerQrcodeComponent): void {
    console.log(action)
    console.log(fn)
    action[fn]().subscribe(console.log, alert);
  }

  public onSelects(files: any): void {
    this.qrcode.loadFiles(files).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  }

  public onSelects2(files: any): void {
    this.qrcode.loadFilesToScan(files, this.config).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      console.log(res);
      this.qrCodeResult2 = res;
    });
  }

  /*confirmDialogQr(): void {
    this.dialogQr.close()
  }

  rejectDialogQr(): void {
    this.dialogQr.close(false)
  }*/

}
