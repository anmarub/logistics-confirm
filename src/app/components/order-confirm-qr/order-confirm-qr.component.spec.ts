import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmQrComponent } from './order-confirm-qr.component';

describe('OrderConfirmQrComponent', () => {
  let component: OrderConfirmQrComponent;
  let fixture: ComponentFixture<OrderConfirmQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderConfirmQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderConfirmQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
