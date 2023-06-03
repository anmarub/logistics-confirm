import { TestBed } from '@angular/core/testing';

import { OrderDetailConfirmServiceService } from './order-detail-confirm-service.service';

describe('OrderDetailConfirmServiceService', () => {
  let service: OrderDetailConfirmServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderDetailConfirmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
