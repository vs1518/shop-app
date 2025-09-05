import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../features/cart/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
<header class="sticky top-0 z-50 bg-white border-b">
  <nav class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <a routerLink="/" class="text-xl font-semibold">Shop<span class="text-blue-600">App</span></a>

    <ul class="hidden md:flex items-center gap-6">
      <li><a routerLink="/catalog" class="hover:text-blue-600">Catalogue</a></li>

      <!-- Icône Panier avec badge -->
      <li>
        <a routerLink="/cart" class="relative inline-flex items-center" aria-label="Ouvrir le panier">
          <!-- Icône -->
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 9m12-9 2 9M9 22a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>

          <!-- Badge -->
          @if (cart.totalQty() > 0) {
            <span
              class="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 rounded-full
                     bg-blue-600 text-white text-xs font-semibold
                     flex items-center justify-center">
              {{ cart.totalQty() }}
            </span>
          }
        </a>
      </li>
    </ul>

    <!-- Mobile hamburger (optionnel si tu l’as déjà) -->
    <button class="md:hidden" aria-label="Ouvrir le menu">
      <svg class="w-6 h-6" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </nav>
</header>
  `
})
export class HeaderComponent {
  cart = inject(CartService);
}
