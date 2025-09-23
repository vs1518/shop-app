import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<section class="max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-semibold mb-6">Tableau de bord</h1>

  <!-- KPI cards -->
  <div class="grid sm:grid-cols-3 gap-4 mb-8">
    <a routerLink="/catalog" class="block p-5 rounded-xl border bg-white hover:shadow transition">
      <div class="text-sm text-gray-500">Produits</div>
      <div class="text-3xl font-bold">{{ productsCount }}</div>
      <div class="text-blue-600 mt-2">Voir le catalogue →</div>
    </a>

    <a routerLink="/categories" class="block p-5 rounded-xl border bg-white hover:shadow transition">
      <div class="text-sm text-gray-500">Catégories</div>
      <div class="text-3xl font-bold">{{ categoriesCount }}</div>
      <div class="text-blue-600 mt-2">Gérer les catégories →</div>
    </a>

    <a routerLink="/admin/orders" class="block p-5 rounded-xl border bg-white hover:shadow transition">
      <div class="text-sm text-gray-500">Commandes</div>
      <div class="text-3xl font-bold">{{ ordersCount }}</div>
      <div class="text-blue-600 mt-2">Voir les commandes →</div>
    </a>
  </div>

  <!-- Quick actions -->
  <div class="rounded-xl border bg-white p-5 mb-8">
    <h2 class="font-semibold mb-3">Actions rapides</h2>
    <div class="flex flex-wrap gap-2">
      <a routerLink="/categories/new" class="px-3 py-2 rounded-lg border hover:bg-gray-50">➕ Nouvelle catégorie</a>
      <a routerLink="/catalog/new" class="px-3 py-2 rounded-lg border hover:bg-gray-50">➕ Nouveau produit</a>
      <a routerLink="/admin/orders" class="px-3 py-2 rounded-lg border hover:bg-gray-50">📦 Gérer les commandes</a>
    </div>
  </div>

  <!-- Last orders -->
  <div class="rounded-xl border bg-white p-5">
    <h2 class="font-semibold mb-3">Dernières commandes</h2>
    @if (lastOrders.length === 0) {
      <p class="text-gray-600">Aucune commande.</p>
    } @else {
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="text-sm text-gray-600">
            <tr>
              <th class="p-2">N°</th>
              <th class="p-2">Client</th>
              <th class="p-2">Articles</th>
              <th class="p-2">Total</th>
              <th class="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            @for (o of lastOrders; track o.id) {
              <tr class="border-t">
                <td class="p-2 font-mono">{{ o.id }}</td>
                <td class="p-2">{{ o.email }}</td>
                <td class="p-2">{{ o.items.length }}</td>
                <td class="p-2">{{ o.total | number:'1.0-0' }} €</td>
                <td class="p-2">{{ o.createdAt | date:'short' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  </div>
</section>
  `
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);

  productsCount = 0;
  categoriesCount = 0;
  ordersCount = 0;
  lastOrders: any[] = [];

  async ngOnInit() {
    const [products, categories, orders] = await Promise.all([
      firstValueFrom(this.http.get<any[]>('/api/products')),
      firstValueFrom(this.http.get<any[]>('/api/categories')),
      firstValueFrom(this.http.get<any[]>('/api/orders')),
    ]);

    this.productsCount = products?.length ?? 0;
    this.categoriesCount = categories?.length ?? 0;
    this.ordersCount = orders?.length ?? 0;
    this.lastOrders = (orders ?? []).slice(0, 5);
  }
}
