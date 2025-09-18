import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../orders/services/order.service';
import { Order } from '../../orders/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
<section class="max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-semibold mb-6">Commandes</h1>

  @if (!orders.length) {
    <div class="p-4 rounded-lg border bg-white text-gray-600">
      Aucune commande pour l’instant.
    </div>
  } @else {
    <div class="overflow-x-auto bg-white border rounded-xl">
      <table class="w-full text-left">
        <thead class="text-sm text-gray-600">
          <tr>
            <th class="p-3">N°</th>
            <th class="p-3">Client</th>
            <th class="p-3">Articles</th>
            <th class="p-3">Total</th>
            <th class="p-3">Date</th>
            <th class="p-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          @for (o of orders; track o.id) {
            <tr class="border-t">
              <td class="p-3 font-mono">{{ o.id }}</td>
              <td class="p-3">{{ o.email }}</td>
              <td class="p-3">{{ o.items.length }}</td>
              <td class="p-3">{{ o.total | number:'1.0-0' }} €</td>
              <td class="p-3">{{ o.createdAt | date:'short' }}</td>
              <td class="p-3">{{ o.status }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  }
</section>
  `
})
export class AdminOrdersComponent implements OnInit {
  private svc = inject(OrderService);
  orders: Order[] = [];

  async ngOnInit() {
    this.orders = await this.svc.listAll();  
  }
}
