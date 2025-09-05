import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { ProductCardComponent } from './product-card.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../cart/services/cart.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
<section class="max-w-7xl mx-auto px-4 py-8">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
    <h2 class="text-2xl font-semibold">Produits</h2>

    <div class="relative">
      <input type="text" (input)="onSearch($event)"
             class="w-72 border rounded-lg px-3 py-2 pr-9"
             placeholder="Rechercher un produit...">
      <span class="absolute right-3 top-2.5">
        <svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clip-rule="evenodd"/></svg>
      </span>
    </div>
  </div>

  <!-- Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    @for (p of productService.filtered(); track p.id) {
      <app-product-card [product]="p" (add)="addToCart(p)"></app-product-card>
    }
  </div>
</section>
  `
})
export class ProductGridComponent {
  productService = inject(ProductService);
  cart = inject(CartService);
  notify = inject(NotificationService);

  onSearch(e: Event) {
    const v = (e.target as HTMLInputElement).value ?? '';
    this.productService.setQuery(v);
  }

   addToCart(p: any) {
    this.cart.add(p);
    this.notify.success(`« ${p.name} » a été ajouté au panier`);
  }
}
