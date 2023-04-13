import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder,
  FormControl,
  FormGroup, Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin, from, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';

import { OrderConfirmQrComponent } from '../order-confirm-qr/order-confirm-qr.component'

@Component({
	selector: 'app-order-confirm',
	templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss']
})
export class OrderConfirmComponent implements AfterViewInit {

  private readonly subscriptions: Subscription[] = [];
  public defaultTime = [new Date().getHours(), 0 , 0];
  filteredListCustomers = []
  totalSum!: number
  public openMenu: boolean = false;
  isOver = false;
  /** control for the MatSelect filter keyword */
  public customerFilterCtrl: FormControl = new FormControl();
  protected onDestroy = new Subject<void>();


  // create form with validators and dynamic rows array
  formOrder: FormGroup = this.fb.group({
    orderDate: ['', [Validators.required, Validators.minLength(2)]], // ok
    serviceDate: ['', [Validators.required, Validators.minLength(2)]], // ok
    dateSendEmail: ['', [Validators.required, Validators.minLength(2)]],
    statusSendEmail: [false, [Validators.required, Validators.minLength(2)]], // ok
    note: ['', []], // ok
    requestedBy: ['', [Validators.required, Validators.minLength(2)]], // ok
    customerId: ['', [Validators.required, Validators.minLength(1)]], // ok
    statusOrderId: [{value: 1, disabled: true}, [Validators.required, Validators.minLength(1)]], // ok

    // load first row at start
    detailsOrder: this.fb.array([this.getDetailsOrder()]),
  });
  // Observable for formArray value changes
  formValueChanges$: Observable<FormArray> =
    this.formOrder.controls.detailsOrder.valueChanges;


  constructor(
    private currencyPipe: CurrencyPipe,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) {}

  @ViewChild('singleSelect', { static: true })
  singleSelect!: MatSelect;

  @ViewChild('selectEmployee', { static: true })
  selectEmployee!: MatSelect;

  ngOnInit(): void {
    this.formOrder.controls.serviceDate.setValue(new Date());
    this.formOrder.controls.orderDate.setValue(new Date());
    this.formOrder.controls.dateSendEmail.setValue(new Date());
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngAfterViewInit(): void {
  }

  clickMenu(){
    this.openMenu = !this.openMenu;
  }

  hello(mex: string){
      alert('Hello '+mex+'!' );
  }

  scanCodeQr(): void {
    this.dialog.open(OrderConfirmQrComponent, {disableClose: true})
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

  /**
   * Create form Details Order
   */
  private getDetailsOrder(): FormGroup {
    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      ordersDetailsId: [0, []],
      startTime: ['', [Validators.required, Validators.minLength(2)]],
      endTime: ['', [Validators.required, Validators.minLength(2)]],
      extraTime: [0, [Validators.required, Validators.pattern(numberPatern)]],
      qty: [1, [Validators.required, Validators.pattern(numberPatern)]],
      Ccoste: ['', [Validators.required, Validators.minLength(1)]],
      ordersId: ['', []],
      note: ['', []],
      productsPriceId: ['', [Validators.required, Validators.minLength(1)]],
      employeeFilterCtrl: new FormControl().setValue(''),
      employeeId: ['', [Validators.required, Validators.minLength(1)]],
      totalHour: [0, [Validators.required, Validators.pattern(numberPatern)]],

      unitTotalPrice: [0, { value: 0, disabled: true }],
    });
  }


  observerFormGroup(): void {
    // subscribe to the stream so listen to changes on units
    const formChange = this.formValueChanges$.subscribe({
      next: (detailsOrder: any) => {
        this.updateTotalUnitPrice(detailsOrder);
      },
      error: (err) => {
        console.error({messageError: err});
      },
      complete: () => {
      }
    });
    this.subscriptions.push(formChange);
  }
  /**
   * Add new detail order row into form
   */
  addDetailsOrder(): void {
    const control = this.formOrder.controls.detailsOrder as FormArray;
    control.push(this.getDetailsOrder());
  }

  /**
   * Remove detail order row from form on click delete button
   */
  removeDetailsOrderId(id: number): void {
    const control = this.formOrder.controls.detailsOrder as FormArray;
    control.removeAt(id);
  }

  /**
   * This is one of the way how clear detail order fields.
   */
  clearAllDetailsOrder(): void {
    const control = this.formOrder.controls.detailsOrder as FormArray;
    while (control.length) {
      control.removeAt(control.length - 1);
    }
    control.clearValidators();
    control.push(this.getDetailsOrder());
  }

  // get details Order form array control
  getControls(): AbstractControl[] {
    return (this.formOrder.get('detailsOrder') as FormArray).controls;
  }




  /**
   * Update prices as soon as something changed on detail order group.
   */
  private updateTotalUnitPrice(units: any): void {

  // get our details group control
  const control = this.formOrder.controls.detailsOrder as FormArray;

  for (const i in units) {
    if (units.hasOwnProperty(i)) {
      const totalPayRoll = 0;
      // now format total price with angular currency pipe
      const totalUnitPriceFormatted = this.currencyPipe.transform(
        totalPayRoll,
        'USD',
        'symbol-narrow',
        '1.2-2'
      );
      // update total sum field on unit and do not emit event myFormValueChanges$ in this case on units
      control.at(+i).patchValue(
          { unitTotalPrice: totalUnitPriceFormatted},
          { onlySelf: true, emitEvent: false }
        );
      // update total price for all units
      this.totalSum += totalPayRoll;
    }
  }
}

}
