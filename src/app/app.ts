import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToasterComponent } from './shared/components/toaster/toaster.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToasterComponent],
  template: `
    <app-header></app-header>
    <main class="min-h-[calc(100vh-64px)] bg-gray-50">
      <router-outlet></router-outlet>
    </main>

    <!-- Toaster global -->
    <app-toaster></app-toaster>
  `
})
export class AppComponent {}
