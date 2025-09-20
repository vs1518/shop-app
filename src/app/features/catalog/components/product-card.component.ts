import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';

@Component({ 
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
<article class="group border rounded-xl overflow-hidden bg-white">
  <div class="aspect-square overflow-hidden">
    <img [src]="product.imageUrl" [alt]="product.name"
         class="w-full h-full object-cover transition-transform group-hover:scale-105">
  </div>
  <div class="p-4 space-y-2">
    <h3 class="font-semibold line-clamp-1">{{ product.name }}</h3>
    <div class="text-sm text-gray-500">{{ product.rating }} ★</div>
    <div class="text-lg font-bold">{{ product.price | number:'1.0-0' }} €</div>
    <button class="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            data-testid="add-btn"
            (click)="add.emit(product)">

      Ajouter au panier
    </button>
  </div>
</article>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() add = new EventEmitter<Product>();
}
