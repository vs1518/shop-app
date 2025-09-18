import { Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout.components';
import { OrderSuccessComponent } from './components/order-success.component';
import { authGuard } from '../auth/guards/auth.guard';
import { nonEmptyCartGuard } from './guards/non-empty-cart.guard';

export const ORDERS_ROUTES: Routes = [
  { path: '', canActivate: [authGuard, nonEmptyCartGuard], component: CheckoutComponent },
  { path: 'success/:id', canActivate: [authGuard], component: OrderSuccessComponent },
];
