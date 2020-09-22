import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-term-input',
  templateUrl: './term-input.component.html',
  styleUrls: ['./term-input.component.css']
})
/**
 * responsibles for the term input.
 */
export class TermInputComponent implements OnInit {
  @Output() emitter = new EventEmitter<string>();
  termValue: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  /**
   * emits the term to the parent 'inputs' component while the input value changes.
   */
  emitTerm() : void {
    this.emitter.emit(this.termValue);
  }
}
