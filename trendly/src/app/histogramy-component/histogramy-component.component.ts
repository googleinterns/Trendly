import {Component} from '@angular/core';
import {DataService} from '../data.service';

interface InputObj {
  startDate: string;
  endDate: string;
  term: string;
  country: string;
  interval: number;
  category: string;
}

/**
 * Histogramy feature component.
 */
@Component({
  selector: 'app-histogramy-component',
  templateUrl: './histogramy-component.component.html',
  styleUrls: ['./histogramy-component.component.css']
})
export class HistogramyComponentComponent {
  readonly TopTopicsTitle: string = 'Top Topics'
  readonly RisingTopicsTitle: string = 'Rising Topics'
  dataTop;
  dataRising;
  showMatProgress: boolean = true;

  constructor(private dataService: DataService) {
    const defaultDates: string[] = this.getDefaultDates();
    this.callServlets('', defaultDates[0], defaultDates[1], '', 1, '0');
  }

  /**
   * Returns default dates (one year back).
   */
  private getDefaultDates(): string[] {
    let end: Date = new Date();
    let month: string = '' + end.getMonth();
    month = month.length === 1 ? '0' + month : month;
    let yearEnd = '' + end.getFullYear();
    let yearStart = '' + (end.getFullYear() - 1)

    return [yearStart + '-' + month, yearEnd + '-' + month];
  }

  /**
   * Gets data from server according to the given parameters. (for now just
   * printing).
   */
  getDataFromServer(input: InputObj) {
    console.log(input);
    this.showMatProgress = true;
    this.callServlets(
        input['term'], input['startDate'], input['endDate'], input['country'],
        input['interval'], input['category']);
  }

  /**
   * Calls top-topics and rising-topics servlets and changes the data
   * accordingly.
   */
  private callServlets(
      term: string, startDate: string, endDate: string, country: string,
      interval: number, category: string) {
    this.dataService
        .fetchTopTopics(term, startDate, endDate, country, interval, category)
        .subscribe(
            (data) => {
              this.dataTop = {...data};
              console.log(this.dataTop);
            },
            (err) => {
              console.log(err);
              alert(
                  'an error occurred while processing your request. please try again.')
            });

    this.dataService
        .fetchRisingTopics(
            term, startDate, endDate, country, interval, category)
        .subscribe(
            (data) => {
              this.dataRising = {...data};
            },
            (err) => {
              console.log(err);
              alert(
                  'an error occurred while processing your request. please try again.')
            });
  }

  /**
   * Changes the progress bar (which indicates whether data is loadding).
   */
  changeProgress(progress: boolean): void {
    this.showMatProgress = progress;
  }
}
