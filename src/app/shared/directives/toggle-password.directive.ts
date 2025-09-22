import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[togglePassword]',
  exportAs: 'pwToggle'
})
export class TogglePasswordDirective {
  shown = false;

  constructor(private el: ElementRef) {
    this.setType();
  }

  toggle() {
    this.shown = !this.shown;
    this.setType();
  }

  private setType() {
    this.el.nativeElement.type = this.shown ? 'text' : 'password';
  }
}
