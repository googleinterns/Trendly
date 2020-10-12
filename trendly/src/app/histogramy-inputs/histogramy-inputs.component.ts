import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Output} from '@angular/core';
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
    if (this.checkValidity()) {
      this.apply.emit({
        term: this.term,
        startDate: this.startDate,
        endDate: this.endDate,
        country: this.country,
        interval: this.interval
      });
    }
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
  updateStartDate(newStartDate: string): void {
    this.startDate = newStartDate;
  }

  /**
   * Updates the end date.
   */
  updateEndDate(newEndDate: string): void {
    this.endDate = newEndDate;
  }

  // Validity checks.
  /**
   * Checks the validity of start and end dates.
   */
  private dateValidity(): boolean {
    // Format.
    if (!this.startDate.match('20[0-2][0-9]-(1[0-2]|0[1-9])') ||
        !this.endDate.match('20[0-2][0-9]-(1[0-2]|0[1-9])'))
      return false;

    // Start date before End date.
    const startSplit: string[] = this.startDate.split('-');
    const endSplit: string[] = this.endDate.split('-');

    return !(
        startSplit[0] > endSplit[0] ||
        (startSplit[0] === endSplit[0] && startSplit[1] > endSplit[1]));
  }

  /**
   * Checks interval validity.
   */
  private intervalValidity(): boolean {
    const isDecimal: (num: number) => boolean = (num: number) =>
        (num ^ 0) !== num;
    return !(this.interval <= 0 || isDecimal(this.interval));
  }

  /**
   * Checks country validity.
   */
  private countryValidity(): boolean {
    return (
        Object.values(COUNTRY_CODES).includes(this.country) ||
        this.country === '');
  }

  /**
   * Checks validity of all relevant parameters.
   */
  private checkValidity(): boolean {
    let alertMessage: string = '';
    if (!this.dateValidity()) alertMessage += 'Dates Range is Not Valid. ';
    if (!this.intervalValidity()) alertMessage += 'Interval is Not Valid. ';
    if (!this.countryValidity()) alertMessage += 'Country name is Not Valid.';
    if (alertMessage !== '') {
      alertMessage += 'please Enter Parameters Again.'
      window.alert(alertMessage);
      return false;
    }
    return true;
  }
}
