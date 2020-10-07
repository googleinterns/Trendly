import {Component, Input, OnInit} from '@angular/core';
import {ColorsService} from '../colors.service';

interface chartRole {
  role: string;
}
type ColumnArray = Array<chartRole|string>;

interface Topic {
  name: string;
  volume: number;
  description: string;
}

interface DataType {
  [index: string]: Topic[];
}

// TODO: remove when switching to live data.
const MOCK_DATA: DataType = {
  '8/2010': [
    {name: 'apple', volume: 50, description: 'big tech company'},
    {name: 'corona', volume: 50, description: 'a dangerous virus'}
  ],
  '9/2010': [
    {name: 'apple', volume: 30, description: 'big tech company'},
    {name: 'elections', volume: 10, description: 'elections'},
    {name: 'corona', volume: 80, description: 'a dangerous virus'}
  ],
  '10/2010': [
    {name: 'elections', volume: 80, description: 'elections'},
    {name: 'corona', volume: 100, description: 'a dangerous virus'},
    {name: 'pizza', volume: 20, description: 'very tasty food'}
  ],
};
const TOOLTIP_ROLE_NAME = 'tooltip';
const STYLE_ROLE_NAME = 'style';
const COLUMN_TOPIC = 'Topic';
const COLUMN_CHART_TYPE = 'ColumnChart';
const NUM_OF_COL_PER_TOPIC = 3;
const FIRST_TOPIC_COL = 1;
const SECOND_TOPIC_COL = 2;
const THIRD_TOPIC_COL = 3;
const TOOLTIP_ROLE: chartRole = {
  role: TOOLTIP_ROLE_NAME
};
const STYLE_ROLE = {
  role: STYLE_ROLE_NAME
};


/**
 * Responsibles for the charts view.
 */
@Component({
  selector: 'app-histogram-section',
  templateUrl: './histogram-section.component.html',
  styleUrls: ['./histogram-section.component.css']
})
export class HistogramSectionComponent implements OnInit {
  @Input() title: string;  // get from parent
  @Input() type: string = COLUMN_CHART_TYPE;
  @Input() data: Array<Array<string|number>> = [];
  @Input() columnNames: ColumnArray = [];
  @Input()
  readonly options: object = {
    width: window.innerWidth / 3,
    height: window.innerWidth / 4,
    legend: {position: 'top', maxLines: 3},
    bar: {groupWidth: '75%'},
    isStacked: true,
    colors: this.coloresService._lightColorShow,
  };

  /**
   * The constructor - injects color service.
   */
  constructor(private coloresService: ColorsService) {}

  ngOnInit(): void {
    // this function should be call after data retrival from server, will change
    // after creating backend
    this.convertDataToChartsFormat();
  }

  /**
   * Converts the data from the server to charts format.
   */
  convertDataToChartsFormat() {
    const topics: Map<string, number> = this.extractTopics(MOCK_DATA);
    this.createColumnNames(topics);
    this.createData(topics);
  }

  /**
   * Extracts and returns the topics mapped to their index.
   */
  extractTopics(data: DataType): Map<string, number> {
    const topics: Map<string, number> = new Map<string, number>();
    let counter: number = 0;
    Object.keys(data)
        .reduce((elements, key) => elements.concat(data[key]), [])
        .forEach((element) => {
          if (!topics.has(element.name)) {
            topics.set(element.name, counter);
            counter++;
          }
        });
    return topics;
  }

  /**
   * Creates the columns forthe chart.
   */
  createColumnNames(topics: Map<string, number>): void {
    this.columnNames = [];
    this.columnNames.push(COLUMN_TOPIC);
    // sort map according values in rising order.
    topics = new Map([...topics.entries()].sort((a, b) => a[1] - b[1]));
    [...topics.keys()].forEach(
        (key) => this.columnNames.push(...[key, TOOLTIP_ROLE, STYLE_ROLE]));
    console.log(this.columnNames);
  }

  /**
   * Creates the data for the charts.
   */
  private createData(topics: Map<string, number>): void {
    Object.keys(MOCK_DATA).forEach((date) => {
      const row = Array((topics.size * NUM_OF_COL_PER_TOPIC) + 1).fill('');
      this.initializeRowArray(row);
      row[0] = date;

      [...MOCK_DATA[date]].forEach((element) => {
        const index = topics.get(element.name) * NUM_OF_COL_PER_TOPIC;
        const indexColor = topics.get(element.name);
        row[index + FIRST_TOPIC_COL] = element.volume;
        row[index + SECOND_TOPIC_COL] = element.description;
        row[index + THIRD_TOPIC_COL] =
            this.coloresService._lightColorShow[indexColor];
      });
      this.data.push(row);
    });
  }

  /**
   * Initializes one row in the data.
   * @param array
   */
  private initializeRowArray(array: Array<string|number>): void {
    for (let i = 1; i < array.length; i += NUM_OF_COL_PER_TOPIC) {
      array[i] = 0;
    }
  }
}
