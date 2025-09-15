import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
<section class="max-w-4xl mx-auto px-4 py-10">
  <h1 class="text-2xl font-semibold">Espace Admin</h1>
  <p class="text-gray-600 mt-2">Zone protégée par AdminGuard.</p>
</section>
  `
})
export class AdminDashboardComponent {}
