import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COUNTRY_CODES} from 'src/app/country-input/country-input.component';

interface InputObj {
  startDate: string, endDate: string, term: string, country: string,
      interval: number,
}
;

/**
 * Responsible for all the user inputs.
 */
@Component({
  selector: 'app-histogramy-inputs',
  templateUrl: './histogramy-inputs.component.html',
  styleUrls: [
    './histogramy-inputs.component.css',
    '../../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
  ]

})
export class InputsComponent {
  startDate: string;
  endDate: string;
  term: string = '';
  country: string = '';
  interval: number = 1;
  @Output() apply = new EventEmitter<InputObj>();

  constructor(private datePipe: DatePipe) {
    this.startDate = this.datePipe.transform(new Date(2003, 12, 30), 'yyyy-MM');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM');
  }

  /**
   * Emits all the user inputs to the parent component.
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
