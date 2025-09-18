import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  placeOrder(payload: Omit<Order, 'id' | 'createdAt' | 'status'>) {
    return firstValueFrom(this.http.post<Order>('/api/orders', payload));
  }
  get(id: string) {
    return firstValueFrom(this.http.get<Order>(`/api/orders/${id}`));
  }
  listAll() { // admin
    return firstValueFrom(this.http.get<Order[]>('/api/orders'));
  }
}
