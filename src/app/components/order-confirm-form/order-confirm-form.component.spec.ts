import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmFormComponent } from './order-confirm-form.component';

describe('OrderConfirmFormComponent', () => {
  let component: OrderConfirmFormComponent;
  let fixture: ComponentFixture<OrderConfirmFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderConfirmFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderConfirmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
