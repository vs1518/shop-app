import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe, HighlightPipe],
  template: `
<section class="max-w-6xl mx-auto px-4 py-8">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
    <h1 class="text-2xl font-semibold">Catégories</h1>
    <a routerLink="/categories/new" class="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Nouvelle catégorie</a>
  </div>

  <div class="mb-4">
    <input type="text" (input)="onSearch($event)" class="w-full sm:w-80 border rounded-lg px-3 py-2"
           placeholder="Rechercher par nom/slug/description…">
  </div>

  <div class="overflow-x-auto bg-white border rounded-xl">
    <table class="w-full text-left">
      <thead class="text-sm text-gray-600">
        <tr>
          <th class="p-3">Nom</th>
          <th class="p-3">Slug</th>
          <th class="p-3">Description</th>
          <th class="p-3">Statut</th>
          <th class="p-3 w-40">Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (c of svc.filtered(); track c.id) {
          <tr class="border-t">
            <td class="p-3" [innerHTML]="c.name | highlight: svc.query()"></td>
            <td class="p-3 text-gray-600">{{ c.slug }}</td>
            <td class="p-3 text-gray-600">{{ c.description | truncate:80 }}</td>
            <td class="p-3">
              <span class="px-2 py-1 text-xs rounded-full"
                    [class.bg-green-100]="c.isActive" [class.text-green-800]="c.isActive"
                    [class.bg-gray-100]="!c.isActive" [class.text-gray-700]="!c.isActive">
                {{ c.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="p-3 space-x-2">
              <a [routerLink]="['/categories', c.id]" class="text-blue-600 hover:underline">Éditer</a>
              <button class="text-red-600 hover:underline" (click)="delete(c.id)">Supprimer</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</section>
  `
})
export class CategoryListComponent implements OnInit {
  svc = inject(CategoryService);
  async ngOnInit() { await this.svc.loadAll(); }

  onSearch(e: Event) {
    const v = (e.target as HTMLInputElement).value ?? '';
    this.svc.setQuery(v);
  }
  async delete(id: string) {
    if (confirm('Supprimer cette catégorie ?')) await this.svc.remove(id);
  }
}
