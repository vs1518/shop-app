import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({ selector: '[appDebounceClick]', standalone: true })
export class DebounceClickDirective {
  @Input() debounceTime = 400;
  @Output() appDebounceClick = new EventEmitter<Event>();

  private timeout?: any;

  @HostListener('click', ['$event'])
  click(e: Event) {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.appDebounceClick.emit(e), this.debounceTime);
  }
}
