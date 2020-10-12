import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

export interface InputObj {
  startDate: string, endDate: string, terms: string[], country: string,
      category: string,
}

@Component({
  selector: 'app-clusterly-inputs',
  templateUrl: './clusterly-inputs.component.html',
  styleUrls: ['./clusterly-inputs.component.css']
})
export class ClusterlyInputsComponent implements OnInit {
  // Inputs are initialized to default values.
  startDate: string = '2004-01';
  endDate: string = '';
  terms: string[] = [''];
  country: string = '';
  category: string = '0';
  @Output() apply = new EventEmitter<InputObj>();

  /** Sends the default input values when the component is loaded. */
  ngOnInit(): void {
    this.sendParameters();
  }

  /**
   * Emits all the user inputs to the parent component.
   */
  sendParameters(): void {
    this.apply.emit({
      terms: this.terms,
      startDate: this.startDate,
      endDate: this.endDate,
      country: this.country,
      category: this.category
    });
  }

  /**
   * Updates the term.
   * @param newTerm
   */
  updateTerms(newTerms: string[]): void {
    this.terms = newTerms;
  }

  /**
   * Updates the country.
   * @param newCountry
   */
  updateCountry(newCountry: string): void {
    this.country = newCountry;
  }

  /**
   * Updates the start date.
   * @param newStartDate
   */
  updateStartDate(newStartDate: string): void {
    this.startDate = newStartDate;
  }

  /**
   * Updates the end date.
   * @param newEndDate
   */
  updateEndDate(newEndDate: string): void {
    this.endDate = newEndDate;
  }

  /**
   * Updates the category.
   * @param newCategory
   */
  updateCategory(newCategory: string): void {
    this.category = newCategory;
  }
}
