import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
<header class="sticky top-0 z-50 bg-white border-b">
  <nav class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <a routerLink="/" class="text-xl font-semibold">Shop<span class="text-blue-600">App</span></a>

    <!-- Desktop -->
    <ul class="hidden md:flex items-center gap-6">
      <li><a routerLink="/catalog" class="hover:text-blue-600">Catalogue</a></li>
      <li><a routerLink="/cart" class="hover:text-blue-600">Panier</a></li>
      <li>
        <button class="hs-dropdown-toggle inline-flex items-center gap-1"
                type="button" data-hs-dropdown="#account-menu">
          Compte
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.174l3.71-3.944a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"/></svg>
        </button>
        <div id="account-menu" class="hs-dropdown hidden mt-2 bg-white border rounded-lg shadow p-2">
          <a class="block px-3 py-2 hover:bg-gray-50 rounded">Connexion</a>
          <a class="block px-3 py-2 hover:bg-gray-50 rounded">Inscription</a>
        </div>
      </li>
    </ul>

    <!-- Mobile hamburger -->
    <button class="md:hidden hs-collapse-toggle" data-hs-collapse="#m-nav">
      <span class="sr-only">Ouvrir le menu</span>
      <svg class="w-6 h-6" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </nav>

  <!-- Mobile menu -->
  <div id="m-nav" class="hs-collapse hidden md:hidden border-t">
    <ul class="px-4 py-3 space-y-2">
      <li><a routerLink="/catalog" class="block py-2">Catalogue</a></li>
      <li><a routerLink="/cart" class="block py-2">Panier</a></li>
      <li><a class="block py-2">Connexion</a></li>
    </ul>
  </div>
</header>
  `
})
export class HeaderComponent {}
