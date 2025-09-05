import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
<section class="max-w-5xl mx-auto px-4 py-8">
  <h2 class="text-2xl font-semibold mb-6">Mon panier</h2>

  @if (cart.items().length === 0) {
    <p class="text-gray-600">Votre panier est vide.</p>
  } @else {
    <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div class="space-y-4">
        @for (it of cart.items(); track it.product.id) {
          <div class="flex gap-4 border rounded-lg p-3">
            <img [src]="it.product.imageUrl" [alt]="it.product.name" class="w-24 h-24 object-cover rounded">
            <div class="flex-1">
              <h3 class="font-medium">{{ it.product.name }}</h3>
              <div class="text-sm text-gray-500">{{ it.product.price | number:'1.0-0' }} €</div>
              <div class="mt-2 flex items-center gap-2">
                <button class="px-2 py-1 border rounded" (click)="dec(it.product.id)">-</button>
                <span class="w-8 text-center">{{ it.qty }}</span>
                <button class="px-2 py-1 border rounded" (click)="inc(it.product.id)">+</button>
                <button class="ml-4 text-red-600" (click)="cart.remove(it.product.id)">Supprimer</button>
              </div>
            </div>
          </div>
        }
      </div>

      <aside class="border rounded-lg p-4 h-fit space-y-3">
        <div class="flex justify-between">
          <span>Articles</span>
          <span>{{ cart.totalQty() }}</span>
        </div>
        <div class="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{{ cart.totalPrice() | number:'1.0-0' }} €</span>
        </div>
        <button class="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Commander</button>
      </aside>
    </div>
  }
</section>
  `
})
export class CartPanelComponent {
  cart = inject(CartService);
  inc(id: string) { this.cart.setQty(id, (this.cart.items().find(i => i.product.id === id)?.qty ?? 0) + 1); }
  dec(id: string) { this.cart.setQty(id, (this.cart.items().find(i => i.product.id === id)?.qty ?? 0) - 1); }
}
