import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _count = signal(0);
  pending = computed(() => this._count() > 0);

  start() { this._count.update(c => c + 1); }
  stop()  { this._count.update(c => Math.max(0, c - 1)); }
}
