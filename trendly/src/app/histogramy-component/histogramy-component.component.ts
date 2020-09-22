import { Component, OnInit } from '@angular/core';

interface InputObj {
  startDate: Date,
  endDate: Date,
  term: string,
  country: string,
  interval: number,
}

@Component({
  selector: 'app-histogramy-component',
  templateUrl: './histogramy-component.component.html',
  styleUrls: ['./histogramy-component.component.css']
})
/**
 * component of histogramy feature.
 */
export class HistogramyComponentComponent implements OnInit {
  readonly TopTopicsTitle : string = 'Top Topics'
  readonly RisingTopicsTitle : string = 'Rising Topics'

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * gets data from server according to the given parameters. (for now just printing).
   * @param input 
   */
  getDataFromServer(input: InputObj)
  {
    console.log(input['term']);
    console.log(input['interval']);
    console.log(input['startDate']);
    console.log(input['endDate']);
    console.log(input['country']);
  }
}
