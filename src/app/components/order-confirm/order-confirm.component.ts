import { IOrderDetailsModel } from './../../shared/model/orderDetails.model';
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
import { IAccGroupConfirm, IOrderDetailsConfirmModel, ITotalAmountRef } from 'src/app/shared/model/orderDetailsConfirm.model';
import { OrderDetailService } from 'src/app/shared/service/order-detail.service';
import { OrderDetailConfirmServiceService } from 'src/app/shared/service/order-detail-confirm-service.service';

@Component({
	selector: 'app-order-confirm',
	templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss']
})
export class OrderConfirmComponent implements OnInit, OnDestroy {

  dataSourceOrder = new MatTableDataSource<IOrderDetailsModel>();
  dataSourceConfirm = new MatTableDataSource<IOrderDetailsConfirmModel>();
  dataSourceRefund = new MatTableDataSource<IOrderDetailsConfirmModel>();
  private TotalRefKgConfirm: ITotalAmountRef[] = [];
  private TotalRefKgRefund: ITotalAmountRef[] = [];

  displayedColumnsOrder = ['reference', 'qty_cil_order', 'qyt_cil_confirm', 'total_weight', 'total_weight_return'];
  displayedColumnsConfirm = ['code', 'reference', 'weight'];
  displayedColumnsRefund = ['code', 'reference', 'weight'];



  totalSum!: number;
  id!: string;
  public openMenu: boolean = false;
  isOver: boolean = false;
  isLoading: boolean = true;
  items_order_confirm: IOrderDetailsConfirmModel[] = [];
  /** control for the MatSelect filter keyword */
  public customerFilterCtrl: FormControl = new FormControl();
  protected onDestroy = new Subject<void>();


  // create form with validators and dynamic rows array
  formOrder: FormGroup = this.fb.group({
    id_order_SF: ['', [Validators.required, Validators.minLength(2)]],
    id_order_WL: ['', [Validators.required, Validators.minLength(2)]],
    customer_code: ['', [Validators.required, Validators.minLength(2)]],
    customer_name: ['', []],
    comment_confirm: ['', []],
  });

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private order: OrderService,
    private detail: OrderDetailService,
    private confirm: OrderDetailConfirmServiceService,
    private router: Router,
    private idRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.idRouter.snapshot.params.id;
    console.log(this.id)
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
    // '01219852'
    this.order.getIdOrderMontacarga(this.id)
    .subscribe({
      next: (get_order: IOrderModel) => {
        this.formOrder.patchValue({
          id_order_SF: get_order.id_order_SF ?? "Sin Datos",
          id_order_WL: get_order.id_order_WL ?? "Sin Datos",
          customer_code: get_order.customer_code ?? "Sin Datos",
          customer_name: get_order.customer_name ?? "Sin Datos",
          comment_confirm: get_order.comment_confirm,
        });

        if(get_order.orderDetail != undefined) {
          this.dataSourceOrder.data = get_order.orderDetail
          .filter(item => item.qty_cil_order > 0);
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isLoading = false

      }
    })
  }

  scanCodeQr(isQrForm: boolean): void {
    let dataConfirm: IOrderDetailsConfirmModel[];
    this.dialog.open(OrderConfirmQrComponent, {
      data: isQrForm,
      panelClass: 'custom-dialog-container',
      disableClose: true})
    .afterClosed()
    .pipe(take(1), takeUntil(this.onDestroy))
    .subscribe({
      next: (get_confirm: IOrderDetailsConfirmModel[]) => {

        dataConfirm = get_confirm;
        this.items_order_confirm = get_confirm;

        dataConfirm.forEach((item_confirm) => {
          if(item_confirm.type_move) {
            this.dataSourceConfirm.data.push(item_confirm);
          } else {
            this.dataSourceRefund.data.push(item_confirm);
          }
        });

      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.TotalRefKgConfirm = this.gruopDatadelivery(this.dataSourceConfirm.data);
        this.TotalRefKgRefund = this.gruopDatadelivery(this.dataSourceRefund.data);
        this.dataSourceOrder.data = this.totalAmountOrderConfirm();
        this.dataSourceOrder.data = this.totalAmountOrderRefuse();
        this.dataSourceConfirm._updateChangeSubscription();
        this.dataSourceRefund._updateChangeSubscription();
      }
    });

    this.openMenu = false;
  }

  totalAmountOrderConfirm(): IOrderDetailsModel[] {
    const x: IOrderDetailsModel[] = this.dataSourceOrder.data
    .map(order => {
      const confirm = this.TotalRefKgConfirm.find(c => c.type_cil_confirm === order.type_cil_order);
      if (confirm) {
        return {
          ...order,
          qty_cil_confirm: confirm.qty_cil_confirm,
          kg_cil_Confirm: confirm.kg_cil_confirm,
        }
      } else {
        return order;
      }
    });
  return x;
  }

  totalAmountOrderRefuse(): IOrderDetailsModel[] {
    const x: IOrderDetailsModel[] = this.dataSourceOrder.data
    .map(order => {
      const refuse = this.TotalRefKgRefund.find(c => c.type_cil_confirm === order.type_cil_order);
      if (refuse) {
        return {
          ...order,
          kg_cil_Return: refuse.kg_cil_confirm,
        }
      } else {
        return order;
      }
    });
  return x;
  }

  getTotalKgConfirm(): number {
    return this.dataSourceConfirm.data.map(confirm => confirm.kg_cil_confirm).reduce((acc, value) => acc + value, 0.0);
  }

  getTotalKgRefuse(): number {
    return this.dataSourceRefund.data.map(confirm => confirm.kg_cil_confirm).reduce((acc, value) => acc + value, 0.0);
  }

  validateNameReference(text: string, qtyKg: number, reference: string): boolean {
    const regexp = new RegExp(reference, "i")
    return text.includes(qtyKg.toString()) && text.match(regexp) ?  true : false;
  }

  gruopDatadelivery(data_confirm: IOrderDetailsConfirmModel[]): ITotalAmountRef[] {
    return Object.values(data_confirm.reduce((acc: IAccGroupConfirm, current) => {
      const key = current.type_cil_confirm;
      const kg = current.kg_cil_confirm;
      const qty = current.qty_cil_confirm;

      if (!acc[key]) {
        acc[key] = { type_cil_confirm: key, kg_cil_confirm: 0.0, qty_cil_confirm: 0 };
      }

      acc[key].kg_cil_confirm += kg;
      acc[key].qty_cil_confirm += qty;
      return acc;
    }, {}));
  }

  saveOrder(): void {
    let idOrder: number;
    const saveOrder: IOrderModel = {
      id_order_SF: this.formOrder.controls.id_order_SF.value,
      id_order_WL: this.formOrder.controls.id_order_WL.value,
      customer_code: this.formOrder.controls.customer_code.value,
      customer_name: this.formOrder.controls.customer_name.value,
      comment_confirm: this.formOrder.controls.comment_confirm.value
    }
    this.order.addOrder(saveOrder)
    .pipe(take(1), takeUntil(this.onDestroy))
    .subscribe({
      next: (order) => {
        idOrder = order.id_order ?? 0;
        console.log(order);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        //this.saveDetails(idOrder);
        this.saveConfirm(idOrder);
      }
    });
  }

  saveDetails(order_id: number): void {
    const detailsOrder = this.dataSourceOrder.data.slice();
    const details_order: IOrderDetailsModel[] = [];

    detailsOrder.map(item => {
      const saveDetail: IOrderDetailsModel = {
        order_id: order_id,
        code_cil_order: item.code_cil_order,
        type_cil_order: item.type_cil_order,
        qty_cil_order: item.qty_cil_order,
        tara_cil_order: item.tara_cil_order,
        kg_cil_order: item.kg_cil_order
      }
      details_order.push(saveDetail);
    });

    console.log(details_order);

    this.detail.addOrderDetailsArray(details_order)
    .pipe(take(1), takeUntil(this.onDestroy))
    .subscribe({
      next: (order_detail) => {
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {}
    });
  }

  saveConfirm(order_id: number): void {
    const confirmOrderDetails = this.items_order_confirm.slice();
    const details_confirm: IOrderDetailsConfirmModel[] = [];

    confirmOrderDetails.map(item => {
      const confirm: IOrderDetailsConfirmModel = {
        order_id: order_id,
        code_cil_confirm: item.code_cil_confirm,
        type_cil_confirm: item.type_cil_confirm,
        qty_cil_confirm: item.qty_cil_confirm,
        kg_cil_confirm: item.kg_cil_confirm,
        type_move: item.type_move,
        tara_cil_confirm: +item.tara_cil_confirm
      }
      details_confirm.push(confirm);
    });

    console.log(details_confirm);

    this.confirm.addOrderConfirmArray(details_confirm)
    .pipe(take(1), takeUntil(this.onDestroy))
    .subscribe({
      next: (order_confirm) => {},
      error: () => {},
      complete: () => {}
    });
  }

}
