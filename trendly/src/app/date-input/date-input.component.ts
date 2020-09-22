import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

import * as _moment from 'moment';

import {Moment} from 'moment';

const moment =  _moment;

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
/**
 * responsibles for dates input
 */
export class DateInputComponent implements OnInit {
  @Output() emitterStart = new EventEmitter<any>();
  @Output() emitterEnd = new EventEmitter<any>();
   startDate = new FormControl(moment());
   endDate = new FormControl(moment());
   minDate = new Date(2004, 1, 1);
   maxDate = new Date();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * handler for choosing year for start date.
   * @param normalizedYear 
   */
  chosenYearHandlerStart(normalizedYear: Moment) 
  {
    this.chosenYearHandler(normalizedYear, this.startDate)
  }

  /**
   * handler for choosing year for end date.
   * @param normalizedYear 
   */
  chosenYearHandlerEnd(normalizedYear: Moment) 
  {
    this.chosenYearHandler(normalizedYear, this.endDate)
  }

  /**
   * handler for choosing month for start date.
   * @param normalizedMonth 
   * @param datepicker 
   */
  chosenMonthHandlerStart(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>)
  {
    this.chosenMonthHandler(normalizedMonth, datepicker, this.startDate)
  }

  /**
   * handler for choosing month for end date.
   * @param normalizedMonth 
   * @param datepicker 
   */
  chosenMonthHandlerEnd(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>)
  {
    this.chosenMonthHandler(normalizedMonth, datepicker, this.endDate)
  }

  /**
   * handler for choosing year.
   * @param normalizedYear 
   * @param date 
   */
  chosenYearHandler(normalizedYear: Moment, date : any) {
    const ctrlValue = date.value;
    ctrlValue.year(normalizedYear.year());
    date.setValue(ctrlValue);
  }

  /**
   * handler for choosig month
   * @param normalizedMonth 
   * @param datepicker 
   * @param date 
   */
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, date : any) {
    const ctrlValue = date.value;
    ctrlValue.month(normalizedMonth.month());
    date.setValue(ctrlValue);
    datepicker.close();
  }

  /**
   * emits start date while the input value changes.
   */
  emitStartDate() : void {
    //**for month name MMMM in foemat */
    this.emitterStart.emit(this.startDate.value.format('M YYYY'));
  }

  /**
   * emits end date while the input value changes.
   */
  emitEndDate() : void {
    this.emitterEnd.emit(this.endDate.value.format('M YYYY'));
  }

}
