import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CartService } from '../../cart/services/cart.service';

export const nonEmptyCartGuard: CanActivateFn = () => {
  const cart = inject(CartService);
  const router = inject(Router);
  if (cart.items().length > 0) return true;
  router.navigate(['/catalog']);
  return false;
};
