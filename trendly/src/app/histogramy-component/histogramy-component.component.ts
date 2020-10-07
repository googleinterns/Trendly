import {Component} from '@angular/core';

interface InputObj {
  startDate: Date;
  endDate: Date;
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

  /**
   * Gets data from server according to the given parameters. (for now just
   * printing).
   */
  getDataFromServer(input: InputObj) {
    console.log(input['term']);
    console.log(input['interval']);
    console.log(input['startDate']);
    console.log(input['endDate']);
    console.log(input['country']);
  }
}
