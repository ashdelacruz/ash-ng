import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisallowSpaces]'
})
export class DisallowSpacesDirective {

  constructor() { }

  @HostListener('keypress', ['$event']) disallowSpace(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Spacebar') {
      // ' ' is standard, 'Spacebar' was used by IE9 and Firefox < 37
      e.preventDefault();
    }
  }


}
