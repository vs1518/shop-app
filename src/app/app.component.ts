import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { LoadingIndicatorComponent } from './shared/components/loading-indicator/loading-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToasterComponent, LoadingIndicatorComponent],
  template: `
    <!-- Skip link visible au clavier -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only absolute left-2 top-2 z-[10000] bg-white border px-3 py-2 rounded shadow"
  >
    Aller au contenu
  </a>

  <app-header></app-header>
  <app-loading-indicator></app-loading-indicator>

  <!-- Cible du skip link : id + tabindex=-1 pour focus après le saut -->
  <main id="main-content" tabindex="-1" class="min-h-[calc(100vh-64px)] bg-gray-50">
    <router-outlet></router-outlet>
  </main>

  <app-toaster></app-toaster>
`

})
export class AppComponent {}
