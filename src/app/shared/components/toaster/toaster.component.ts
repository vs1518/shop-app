import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
  <!-- Live region pour l’accessibilité -->
  <div class="sr-only" aria-live="polite">
    @for (t of ns.toasts(); track t.id) { {{ t.message }} }
  </div>

  <div class="fixed inset-0 pointer-events-none z-[9999]">
    <div class="absolute top-4 right-4 space-y-3 w-[90vw] max-w-sm pointer-events-auto">
      @for (t of ns.toasts(); track t.id) {
        <div
          class="rounded-lg border shadow bg-white px-4 py-3 flex items-start gap-3 animate-in fade-in zoom-in-95"
          [class.border-green-200]="t.type === 'success'"
          [class.border-blue-200]="t.type === 'info'"
          [class.border-red-200]="t.type === 'error'">
          <div class="mt-0.5">
            <span
              class="inline-flex h-2.5 w-2.5 rounded-full"
              [class.bg-green-500]="t.type === 'success'"
              [class.bg-blue-500]="t.type === 'info'"
              [class.bg-red-500]="t.type === 'error'"></span>
          </div>
          <div class="text-sm text-gray-800">{{ t.message }}</div>
          <button
            class="ml-auto text-gray-400 hover:text-gray-700"
            (click)="ns.remove(t.id)"
            aria-label="Fermer la notification">
            ✕
          </button>
        </div>
      }
    </div>
  </div>
  `
})
export class ToasterComponent {
  ns = inject(NotificationService);
}
