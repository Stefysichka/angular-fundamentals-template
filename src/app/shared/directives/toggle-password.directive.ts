import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[togglePassword]',
  exportAs: 'togglePassword'
})
export class TogglePasswordDirective {
  private _shown = false;

  constructor(private el: ElementRef) {
    this.setType();
  }

  get shown() {
    return this._shown;
  }

  toggle() {
    this._shown = !this._shown;
    this.setType();
  }

  private setType() {
    this.el.nativeElement.type = this._shown ? 'text' : 'password';
  }
}
