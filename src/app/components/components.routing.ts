import { Routes } from '@angular/router';

import { OrderConfirmComponent } from './order-confirm/order-confirm.component';

export const ComponentsRoutes: Routes = [
  {
    path: 'order-edit/:id',
  component: OrderConfirmComponent
  }
];
