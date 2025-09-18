import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<section class="max-w-xl mx-auto px-4 py-20 text-center">
  <h1 class="text-3xl font-semibold mb-3">Merci pour votre commande ! 🎉</h1>
  <p class="text-gray-700 mb-6">
    Numéro de commande : <span class="font-mono font-semibold">{{ id }}</span>
  </p>
  <a routerLink="/catalog" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Continuer mes achats</a>
</section>
  `
})
export class OrderSuccessComponent {
  id = inject(ActivatedRoute).snapshot.paramMap.get('id');
}
