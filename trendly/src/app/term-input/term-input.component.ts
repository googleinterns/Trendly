import {Component, EventEmitter, OnInit, Output} from '@angular/core';

/**
 * responsibles for the term input.
 */
@Component({
  selector: 'app-term-input',
  templateUrl: './term-input.component.html',
  styleUrls: ['./term-input.component.css']
})
export class TermInputComponent {
  @Output() emitter = new EventEmitter<string>();
  termValue: string = '';
  constructor() {}

  /**
   * emits the term to the parent 'inputs' component while the input value
   * changes.
   */
  emitTerm(): void {
    this.emitter.emit(this.termValue);
  }
}
