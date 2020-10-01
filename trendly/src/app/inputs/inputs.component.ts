import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

interface InputObj {
  startDate: Date, endDate: Date, term: string, country: string,
      interval: number,
}

/**
 * responsible for all the user inputs.
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
  // inputs initiallized to default values.
  startDate: Date = new Date(2004, 1, 1);
  endDate: Date = new Date();
  term: string = '';
  country: string = '';
  interval: number = 1;
  @Output() apply = new EventEmitter<InputObj>();

  constructor() {}

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
   * updates the term.
   * @param newTerm
   */
  updateTerm(newTerm: string): void {
    this.term = newTerm;
  }

  /**
   * updates the interval.
   * @param newInterval
   */
  updateInterval(newInterval: number): void {
    this.interval = newInterval;
  }

  /**
   * updates the country.
   * @param newCountry
   */
  updateCountry(newCountry: string): void {
    this.country = newCountry;
  }

  /**
   * updates the start date
   * @param newStartDate
   */
  updateStartDate(newStartDate): void {
    this.startDate = newStartDate;
  }

  /**
   * updates the end date.
   * @param newEndDate
   */
  updateEndDate(newEndDate): void {
    this.endDate = newEndDate;
  }
}
