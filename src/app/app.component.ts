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
    <app-header></app-header>
    <app-loading-indicator></app-loading-indicator>
    <main class="min-h-[calc(100vh-64px)] bg-gray-50">
      <router-outlet></router-outlet>
    </main>
    <app-toaster></app-toaster>
  `
})
export class AppComponent {}
