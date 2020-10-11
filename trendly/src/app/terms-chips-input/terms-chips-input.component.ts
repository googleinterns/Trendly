import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, EventEmitter, Output} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';

/** A terms input component with mat-chip */
@Component({
  selector: 'app-terms-chips-input',
  templateUrl: './terms-chips-input.component.html',
  styleUrls: ['./terms-chips-input.component.css']
})
export class TermsChipsInputComponent {
  @Output() termsSelected = new EventEmitter<String[]>();
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  terms: String[] = [];


  /**
   * Adds the inserted tem into terms and emits terms to
   * parent component.
   */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add a term + emits the updated terms list
    if ((value || '').trim()) {
      this.terms.push(value.trim());
      this.emitTerms();
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /**
   * Removes the given term from the terms list
   */
  remove(term: String): void {
    const index = this.terms.indexOf(term);
    if (index >= 0) {
      this.terms.splice(index, 1);
      this.emitTerms();
    }
  }

  /**
   * Emits the terms to the parent 'inputs' component when the input value
   * changes.
   */
  private emitTerms(): void {
    this.termsSelected.emit(this.terms);
  }
}
