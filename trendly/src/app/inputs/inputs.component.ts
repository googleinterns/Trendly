import {Component, EventEmitter, Output} from '@angular/core';

interface InputObj {
  startDate: Date, endDate: Date, term: string, country: string,
      interval: number,
}
;

/**
 * Responsible for all the user inputs.
 */
@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: [
    './inputs.component.css',
    '../../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
  ]

})
export class InputsComponent {
  startDate: Date = new Date(2004, 1, 1);
  endDate: Date = new Date();
  term: string = '';
  country: string = '';
  interval: number = 1;
  @Output() apply = new EventEmitter<InputObj>();

  /**
   * emits all the user inputs to the parent component.
   */
  sendParameters(): void {
    this.apply.emit({
      term: this.term,
      startDate: this.startDate,
      endDate: this.endDate,
      country: this.country,
      interval: this.interval
    });
  }

  /**
   * Updates the term.
   */
  updateTerm(newTerm: string): void {
    this.term = newTerm;
  }

  /**
   * Updates the interval.
   */
  updateInterval(newInterval: number): void {
    this.interval = newInterval;
  }

  /**
   * Updates the country.
   */
  updateCountry(newCountry: string): void {
    this.country = newCountry;
  }

  /**
   * Updates the start date
   */
  updateStartDate(newStartDate): void {
    this.startDate = newStartDate;
  }

  /**
   * Updates the end date.
   */
  updateEndDate(newEndDate): void {
    this.endDate = newEndDate;
  }
}
