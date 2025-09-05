import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'error';
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();

  private push(t: Omit<Toast, 'id'>) {
    const toast: Toast = { id: Date.now() + Math.random(), ...t };
    this._toasts.update(list => [...list, toast]);
    const ttl = toast.timeout ?? 2500;
    setTimeout(() => this.remove(toast.id), ttl);
  }

  success(message: string, timeout = 2500) { this.push({ type: 'success', message, timeout }); }
  info(message: string, timeout = 2500)    { this.push({ type: 'info', message, timeout }); }
  error(message: string, timeout = 3000)   { this.push({ type: 'error', message, timeout }); }

  remove(id: number) {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}
