import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if (loading.pending()) {
    <div class="fixed top-0 left-0 right-0 z-[9998]">
      <div class="h-1 w-full bg-blue-100">
        <div class="h-1 w-2/5 animate-pulse bg-blue-600"></div>
      </div>
    </div>
  }
  `
})
export class LoadingIndicatorComponent {
  loading = inject(LoadingService);
}
