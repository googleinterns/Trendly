import {Component} from '@angular/core';

import {InputObj} from '../clusterly-inputs/clusterly-inputs.component';
import {DataService} from '../data.service';

/**
 * Clusterly component - includes Clusterly inputs & clusters-section
 * components and handles fetching data from server based on the user inputs and
 * transfering the returnd data to the relevant component.
 */
@Component({
  selector: 'app-clusterly',
  templateUrl: './clusterly.component.html',
  styleUrls: ['./clusterly.component.css']
})
export class ClusterlyComponent {
  dataFromServer: any;
  isLoading: boolean = false;

  constructor(private dataService: DataService) {}

  getDataFromServer(input: InputObj) {
    this.isLoading = true;
    this.dataService
        .fetchClustrlyData(
            input['terms'], input['startDate'], input['endDate'],
            input['country'], 1, input['category'])
        .subscribe(
            (data) => {
              this.dataFromServer = {...data};
              this.isLoading = false;
            },
            (err) => {
              console.log(err);
              alert(
                  'an error occurred while processing your request. please try again.')
            });
  }
}
