import {Component} from '@angular/core';
import {DataService} from '../data.service';

interface InputObj {
  startDate: string;
  endDate: string;
  term: string;
  country: string;
  interval: number;
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

  constructor(private dataService: DataService) {}

  /**
   * Gets data from server according to the given parameters. (for now just
   * printing).
   */
  getDataFromServer(input: InputObj) {
    console.log(input);

    this.dataService
        .fetchTopTopics(
            input['term'], input['startDate'], input['endDate'],
            input['country'], input['interval'])
        .subscribe((data) => {
          this.dataTop = {...data};
        });

    this.dataService
        .fetchRisingTopics(
            input['term'], input['startDate'], input['endDate'],
            input['country'], input['interval'])
        .subscribe((data) => {
          this.dataRising = {...data};
        });
  }
}
