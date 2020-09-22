import { Component, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';
import {ColorsService} from '../colors.service';

interface ColumnArray {
  [index: number]: object | string;
}

//mock data
const MOCK_DATA = {
  '8/2010' : [{name: 'apple', volume: 50, description:'big tech company'}, {name: 'corona', volume: 50, description:'a dangerous virus'}],
  '9/2010' : [{name: 'apple', volume: 30, description:'big tech company'}, {name: 'elections', volume: 10, description:'elections'}, {name: 'corona', volume: 80, description:'a dangerous virus'}],
  '10/2010' : [{name: 'elections', volume: 80, description:'elections'}, {name: 'corona', volume: 100, description:'a dangerous virus'}, 
  {name: 'pizza', volume: 20, description:'very tasty food'}],
}
@Component({
  selector: 'app-histogram-section',
  templateUrl: './histogram-section.component.html',
  styleUrls: ['./histogram-section.component.css']
})
/**
 * responsibles for the charts view
 */
export class HistogramSectionComponent implements OnInit {
  @Input() title : string; //get from parent
  @Input() type : string = 'ColumnChart';
  @Input() data = [];
  @Input() columnNames : ColumnArray = [];
  @Input() options : object =  
  {
    width: window.innerWidth / 3,
    height: window.innerWidth / 4,
    legend: { position: 'top', maxLines: 3 },
    bar: { groupWidth: '75%' },
    isStacked: true,
    colors: this.coloresService._lightColorShow,
  };

  /**
   * the constructor - injects color service.
   * @param coloresService 
   */
  constructor(private coloresService : ColorsService) {}

  ngOnInit(): void {
    // this function should be call after data retrival from server, will change after creating backend
    this.convertDataToChartsFormat();
  }

  /**
   * converts the data from the server to charts format.
   */
  convertDataToChartsFormat() {
    let topics : Map<string, number> = this.extractTopics(MOCK_DATA);
    this.createColumnNames(topics);
    this.createData(topics);
  }

  /**
   * extracts and returns the topics maps to its' index.
   */
  extractTopics(data: Object) :Map<string, number> {
    let topics : Map<string, number> = new Map<string, number>();
    let counter : number = 0;
    for (let key of Object.keys(data)) {
      for (let element of data[key]) {
        if (!topics.has(element.name))
        {
          topics.set(element.name, counter);
          counter++;
        }
      }
    }
    return topics;
   }

   /**
    * creates the columns forthe chart.
    * @param topics 
    */
   createColumnNames(topics : Map<string, number>) : void {
      this.columnNames[0] = 'Topic';
      let index :number = 0;
     for (let key of topics.keys())
     {
       index = topics.get(key) * 3;
       this.columnNames[(index + 1)] = key;
       this.columnNames[index+ 2] = {role: 'tooltip'};
       this.columnNames[index + 3] = {role: 'style'};
     }
   }

   /**
    * creates the data for the charts.
    * @param topics
    */
   private createData(topics : Map<string, number>) : void{
     this.data = [];
     for (let date of Object.keys(MOCK_DATA)) {
       let row = Array((topics.size * 3) + 1).fill('');
       this.initializeRowArray(row);
       row[0] = date;

       for (let element of MOCK_DATA[date]) {
         let index = topics.get(element.name) * 3;
         let indexColor = topics.get(element.name);
         row[index + 1] = element.volume;
         row[index + 2] = element.description;
         row[index + 3] = this.coloresService._lightColorShow[indexColor];
       }
       this.data.push(row);
     }
     console.log(this.data)
   }

   /**
    * initializes one row in the data.
    * @param array
    */
  initializeRowArray(array : Array<string | number>) : void {
    for (let i = 1; i < array.length; i+=3) {
      array[i] = 0;
    }

  } 
}
