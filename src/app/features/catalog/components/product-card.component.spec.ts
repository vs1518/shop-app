import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../models/product.model';

describe('ProductCardComponent (integration)', () => {
  const mock: Product = {
    id: 'pX', name: 'Produit Test', price: 42, imageUrl: 'http://img', rating: 4.3, tags: ['x']
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, RouterTestingModule], // RouterLink safe
    }).compileComponents();
  });

  it('should render name and price', () => {
    const f = TestBed.createComponent(ProductCardComponent);
    f.componentInstance.product = mock;
    f.detectChanges();

    const el: HTMLElement = f.nativeElement;
    expect(el.textContent).toContain('Produit Test');
    expect(el.textContent?.replace(/\s+/g, ' ')).toContain('42'); // affichage prix
  });

  it('should emit (add) when clicking add button', () => {
    const f = TestBed.createComponent(ProductCardComponent);
    f.componentInstance.product = mock;

    const spy = jasmine.createSpy('onAdd');
    f.componentInstance.add.subscribe(spy);

    f.detectChanges();

    // Priorité au data-testid ; sinon, fallback au premier bouton
    let btn = f.debugElement.query(By.css('[data-testid="add-btn"]'));
    if (!btn) btn = f.debugElement.query(By.css('button'));

    btn.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledOnceWith(mock);
  });
});
