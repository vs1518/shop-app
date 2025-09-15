import { Injectable, computed, signal, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  private _products = signal<Product[]>([]);
  products = this._products.asReadonly();

  private _query = signal('');
  query = this._query.asReadonly();

  filtered = computed(() => {
    const q = this._query().toLowerCase().trim();
    if (!q) return this._products();
    return this._products().filter(p =>
      p.name.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q))
    );
  });

  constructor() {
    // 🔄 Récupère depuis la mock API (delay via interceptor)
    this.http.get<Product[]>('/api/products').subscribe({
      next: products => this._products.set(products),
      error: () => this._products.set([]),
    });
  }

  setQuery(v: string) { this._query.set(v); }

  getById(id: number | string): Product | null {
    const s = String(id);
    return this._products().find(p => String(p.id) === s) ?? null;
  }
}
