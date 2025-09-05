import { Injectable, computed, effect, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>([]);
  products = this._products.asReadonly();

  private _query = signal('');
  query = this._query.asReadonly();

  filtered = computed(() => {
    const q = this._query().toLowerCase().trim();
    if (!q) return this._products();
    return this._products().filter(p =>
      p.name.toLowerCase().includes(q) || p.tags?.some(t => t.includes(q))
    );
  });

  constructor() {
    // mock initial via effect (peut venir d'un fetch HTTP)
    effect(() => {
      if (this._products().length === 0) {
        this._products.set([
          { id: 'p1', name: 'Sneakers Air', price: 129, imageUrl: 'https://picsum.photos/seed/p1/600/600', rating: 4.5, tags: ['shoes', 'sport'] },
          { id: 'p2', name: 'Casque Sans Fil', price: 89, imageUrl: 'https://picsum.photos/seed/p2/600/600', rating: 4.2, tags: ['audio'] },
          { id: 'p3', name: 'Sac à Dos Pro', price: 59, imageUrl: 'https://picsum.photos/seed/p3/600/600', rating: 4.0, tags: ['bag'] }
        ]);
      }
    });
  }

  setQuery(v: string) { this._query.set(v); }
}
