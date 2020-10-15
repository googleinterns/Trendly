import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {Moment} from 'moment';

const moment = _moment;
export const DATE_FORMAT = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
/**
 * Responsibles for dates input.
 */
@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT},
  ],
})
export class DateInputComponent {
  @Output() startSelected = new EventEmitter<any>();
  @Output() endSelected = new EventEmitter<any>();
  startDate = new FormControl(moment('2004-01-01'));
  endDate = new FormControl(moment());
  readonly minDate = new Date(2003, 12, 1);
  readonly maxDate = new Date();

  /**
   * Handler for choosing year for the start date.
   */
  chosenYearHandlerStart(normalizedYear: Moment) {
    this.chosenYearHandler(normalizedYear, this.startDate)
  }

  /**
   * Handler for choosing year for the end date.
   */
  chosenYearHandlerEnd(normalizedYear: Moment) {
    this.chosenYearHandler(normalizedYear, this.endDate)
  }

  /**
   * Handler for choosing month for the start date.
   */
  chosenMonthHandlerStart(
      normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    this.chosenMonthHandler(normalizedMonth, datepicker, this.startDate)
  }

  /**
   * Handler for choosing month for the end date.
   */
  chosenMonthHandlerEnd(
      normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    this.chosenMonthHandler(normalizedMonth, datepicker, this.endDate)
  }

  /**
   * Handler for choosing year.
   */
  private chosenYearHandler(normalizedYear: Moment, date: any) {
    const ctrlValue = date.value;
    ctrlValue.year(normalizedYear.year());
    date.setValue(ctrlValue);
  }

  /**
   * Handler for choosig month.
   */
  private chosenMonthHandler(
      normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, date: any) {
    const ctrlValue = date.value;
    ctrlValue.month(normalizedMonth.month());
    date.setValue(ctrlValue);
    datepicker.close();
  }

  /**
   * Emits start date while the input value changes.
   */
  emitStartDate(): void {
    //**for month name MMMM in foemat */
    this.startSelected.emit(this.startDate.value.format('YYYY-MM'));
  }

  /**
   * Emits end date while the input value changes.
   */
  emitEndDate(): void {
    this.endSelected.emit(this.endDate.value.format('YYYY-MM'));
  }
}
