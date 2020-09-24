import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';

interface InputObj {
  startDate: Date;
  endDate: Date;
  term: string;
  country: string;
  interval: number;
}

/**
 * component of histogramy feature.
 */
@Component({
  selector: 'app-histogramy-component',
  templateUrl: './histogramy-component.component.html',
  styleUrls: ['./histogramy-component.component.css']
})
export class HistogramyComponentComponent implements OnInit {
  readonly TopTopicsTitle : string = 'Top Topics'
  readonly RisingTopicsTitle : string = 'Rising Topics'

  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    console.log(this.dataService.callServlet('/trendly', ['t', 'y', 'l'], '2016 2', '2017 7', 'US', 3));
  }

  /**
   * gets data from server according to the given parameters. (for now just printing).
   * @param input 
   */
  getDataFromServer(input: InputObj) {
    console.log(input['term']);
    console.log(input['interval']);
    console.log(input['startDate']);
    console.log(input['endDate']);
    console.log(input['country']);
  }
}
