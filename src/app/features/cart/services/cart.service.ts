import { Injectable, computed, effect, signal } from '@angular/core';
import { Product } from '../../catalog/models/product.model';

export interface CartItem { product: Product; qty: number; }

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.load());
  items = this._items.asReadonly();

  totalQty = computed(() => this._items().reduce((s, i) => s + i.qty, 0));
  totalPrice = computed(() => this._items().reduce((s, i) => s + i.qty * i.product.price, 0));

  constructor() {
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this._items()));
    });
  }

  add(p: Product, qty = 1) {
    const existing = this._items().find(i => i.product.id === p.id);
    if (existing) {
      this._items.update(xs => xs.map(i => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i));
    } else {
      this._items.update(xs => [...xs, { product: p, qty }]);
    }
  }
  remove(id: string) { this._items.update(xs => xs.filter(i => i.product.id !== id)); }
  setQty(id: string, qty: number) {
    if (qty <= 0) return this.remove(id);
    this._items.update(xs => xs.map(i => i.product.id === id ? { ...i, qty } : i));
  }
  clear() { this._items.set([]); }

  private load(): CartItem[] {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  }
}
