import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true, pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, max = 80, suffix = '…'): string {
    const v = (value ?? '').trim();
    if (v.length <= max) return v;
    return v.slice(0, Math.max(0, max)).replace(/\s+\S*$/, '') + suffix;
  }
}
