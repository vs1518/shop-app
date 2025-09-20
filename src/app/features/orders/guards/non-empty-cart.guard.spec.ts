import { TestBed } from '@angular/core/testing';
import { nonEmptyCartGuard } from './non-empty-cart.guard';
import { CartService } from '../../cart/services/cart.service';
import { Router } from '@angular/router';

class RouterStub { navigate = jasmine.createSpy('navigate'); }

describe('nonEmptyCartGuard', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('blocks when cart is empty and redirects to /catalog', () => {
    const cartStub = { items: () => [] };
    TestBed.configureTestingModule({
      providers: [
        { provide: CartService, useValue: cartStub },
        { provide: Router, useClass: RouterStub },
      ]
    });

    let result: any;
    const mockRoute = {} as import('@angular/router').ActivatedRouteSnapshot;
    const mockState = {} as import('@angular/router').RouterStateSnapshot;
    TestBed.runInInjectionContext(() => { result = nonEmptyCartGuard(mockRoute, mockState); });

    expect(result).toBeFalse();
    const router = TestBed.inject(Router) as any as RouterStub;
    expect(router.navigate).toHaveBeenCalledWith(['/catalog']);
  });

  it('allows when cart has items', () => {
    const cartStub = { items: () => [{ product: { id: 'p1' }, qty: 1 }] };
    TestBed.configureTestingModule({
      providers: [
        { provide: CartService, useValue: cartStub },
        { provide: Router, useClass: RouterStub },
      ]
    });

    let result: any;
    const mockRoute = {} as import('@angular/router').ActivatedRouteSnapshot;
    const mockState = {} as import('@angular/router').RouterStateSnapshot;
    TestBed.runInInjectionContext(() => { result = nonEmptyCartGuard(mockRoute, mockState); });

    expect(result).toBeTrue();
  });
});
