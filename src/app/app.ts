// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="min-h-[calc(100vh-64px)] bg-gray-50">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
