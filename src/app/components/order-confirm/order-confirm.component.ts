import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder,
  FormControl,
  FormGroup, Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, forkJoin, from, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';

import { OrderConfirmQrComponent } from '../order-confirm-qr/order-confirm-qr.component'
import { OrderService } from 'src/app/shared/service/order.service';
import { IOrderModel } from 'src/app/shared/model/order.model';
import { MatTableDataSource } from '@angular/material/table';
import { IOrderDetailsModel } from 'src/app/shared/model/orderDetails.model';

@Component({
	selector: 'app-order-confirm',
	templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss']
})
export class OrderConfirmComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<IOrderDetailsModel>();
  totalSum!: number;
  id!: number;
  public openMenu: boolean = false;
  isOver: boolean = false;
  /** control for the MatSelect filter keyword */
  public customerFilterCtrl: FormControl = new FormControl();
  protected onDestroy = new Subject<void>();


  // create form with validators and dynamic rows array
  formOrder: FormGroup = this.fb.group({
    id_order_SF: ['', [Validators.required, Validators.minLength(2)]],
    id_order_WL: ['', [Validators.required, Validators.minLength(2)]],
    customer_code: ['', [Validators.required, Validators.minLength(2)]],
    customer_name: ['', []],
    comment_confirm: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private order: OrderService,
    private idRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.idRoute.snapshot.params.id;
    this.searchOrderLogistics();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  clickMenu(){
    this.openMenu = !this.openMenu;
  }

  searchOrderLogistics(): void {
    this.order.getIdOrderMontacarga('01191158')
    .subscribe({
      next: (get_order: IOrderModel) => {
        this.formOrder.patchValue({
          id_order_SF: get_order.id_order_SF ?? "Sin Datos",
          id_order_WL: get_order.id_order_WL ?? "Sin Datos",
          customer_code: get_order.customer_code ?? "Sin Datos",
          customer_name: get_order.customer_name ?? "Sin Datos",
          comment_confirm: get_order.comment_confirm,
        });
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log(this.formOrder.value)
      }
    })
  }

  scanCodeQr(isQrForm: boolean): void {
    this.dialog.open(OrderConfirmQrComponent, {
      data: isQrForm,
      panelClass: 'custom-dialog-container',
      disableClose: true})
    .afterClosed()
    .pipe(take(1), takeUntil(this.onDestroy))
    .subscribe({
      next: (object) => {
        console.log(object);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {}
    });
    this.openMenu = false;
  }

}
