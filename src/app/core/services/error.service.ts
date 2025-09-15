import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private notify: NotificationService) {}

  handle(error: unknown) {
    let message = 'Une erreur est survenue.';
    if (error instanceof HttpErrorResponse) {
      const apiMsg = (error.error && (error.error.message || error.error.error)) || '';
      message = apiMsg || `${error.status} ${error.statusText || ''}`.trim();
    } else if (error instanceof Error) {
      message = error.message;
    }
    this.notify.error(message || 'Erreur réseau');
    console.error('[HTTP ERROR]', error);
  }
}
