import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  private _items = signal<Category[]>([]);
  items = this._items.asReadonly();

  private _query = signal('');
  query = this._query.asReadonly();

  filtered = computed(() => {
    const q = this._query().toLowerCase().trim();
    if (!q) return this._items();
    return this._items().filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description ?? '').toLowerCase().includes(q)
    );
  });

  async loadAll(query = ''): Promise<void> {
    const params = query ? new HttpParams().set('query', query) : undefined;
    const res = await this.http.get<Category[]>('/api/categories', { params }).toPromise();
    this._items.set(res ?? []);
  }

  async getById(id: string): Promise<Category | null> {
    const res = await this.http.get<Category>(`/api/categories/${id}`).toPromise().catch(() => null);
    return res!;
  }

  async create(payload: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const res = await this.http.post<Category>('/api/categories', payload).toPromise();
    await this.loadAll(this._query());
    return res!;
  }

  async update(id: string, payload: Partial<Category>): Promise<Category> {
    const res = await this.http.put<Category>(`/api/categories/${id}`, payload).toPromise();
    await this.loadAll(this._query());
    return res!;
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.http.delete<{ deleted: boolean }>(`/api/categories/${id}`).toPromise();
    await this.loadAll(this._query());
    return !!res?.deleted;
  }

  setQuery(v: string) {
    this._query.set(v);
    // Optionnel: reload côté serveur
    this.loadAll(v);
  }

  async existsByName(name: string): Promise<boolean> {
    const params = new HttpParams().set('exists', `name:${name}`);
    const res = await this.http.get<{ exists: boolean }>('/api/categories', { params }).toPromise();
    return !!res?.exists;
  }
}
