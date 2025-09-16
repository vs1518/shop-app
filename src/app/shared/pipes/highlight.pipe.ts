import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  constructor(private s: DomSanitizer) {}
  transform(text: string | null | undefined, query: string | null | undefined): SafeHtml {
    const t = text ?? ''; const q = (query ?? '').trim();
    if (!q) return t;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const html = t.replace(new RegExp(esc, 'gi'), m => `<mark class="bg-yellow-200">${m}</mark>`);
    return this.s.bypassSecurityTrustHtml(html);
  }
}
