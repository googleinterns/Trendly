import {Component, EventEmitter, Output} from '@angular/core';

/**
 * Responsibles for the term input.
 */
@Component({
  selector: 'app-term-input',
  templateUrl: './term-input.component.html',
  styleUrls: ['./term-input.component.css']
})
export class TermInputComponent {
  @Output() termSelected = new EventEmitter<string>();
  termValue: string = '';
  constructor() {}

  /**
   * Emits the term to the parent 'inputs' component while the input value
   * changes.
   */
  emitTerm(): void {
    this.termSelected.emit(this.termValue);
  }
}
