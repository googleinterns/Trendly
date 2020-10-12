import {Component, EventEmitter, HostListener, Input, Output, SimpleChanges} from '@angular/core';

import {ColorsService} from '../colors.service';

interface chartRole {
  role: string;
}
type ColumnArray = Array<chartRole|string>;

interface Topic {
  title: string;
  value: number;
  description: string;
}

interface DataType {
  [index: string]: Topic[];
}

// TODO: remove when switching to live data.
const MOCK_DATA: DataType = {
  '8/2010': [
    {title: 'apple', value: 50, description: 'big tech company'},
    {title: 'corona', value: 50, description: 'a dangerous virus'}
  ],
  '9/2010': [
    {title: 'apple', value: 30, description: 'big tech company'},
    {title: 'elections', value: 10, description: 'elections'},
    {title: 'corona', value: 80, description: 'a dangerous virus'}
  ],
  '10/2010': [
    {title: 'elections', value: 80, description: 'elections'},
    {title: 'corona', value: 100, description: 'a dangerous virus'},
    {title: 'pizza', value: 20, description: 'very tasty food'}
  ],
};
const TOOLTIP_ROLE_NAME = 'tooltip';
const STYLE_ROLE_NAME = 'style';
const COLUMN_TOPIC = 'Topic';
const COLUMN_CHART_TYPE = 'ColumnChart';
const NUM_OF_COL_PER_TOPIC = 3;
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
export class HistogramSectionComponent {
  @Input() trendsData: DataType;
  @Input() title: string;  // get from parent
  @Input() type: string = COLUMN_CHART_TYPE;
  @Input() data: Array<Array<string|number>> = [];
  @Input() columnNames: ColumnArray = [];
  @Input()
  options: object = {
    width: 3 * (window.innerWidth / 5),
    height: window.innerWidth / 4,
    legend: {position: 'top', maxLines: 3},
    bar: {groupWidth: '75%'},
    isStacked: true,
    colors: this.coloresService.lightColors,
    explorer: {actions: ['dragToZoom', 'rightClickToReset']},
  };
  @Output() progress = new EventEmitter<boolean>();

  constructor(private coloresService: ColorsService) {}


  /**
   * Converts the data from the server to charts format.
   */
  convertDataToChartsFormat() {
    const topics: Map<string, number> = this.extractTopics(this.trendsData);
    this.createColumnNames(topics);
    this.createData(topics);
  }

  /**
   * Extracts and returns the topics mapped to their index.
   */
  private extractTopics(data: DataType): Map<string, number> {
    const topics: Map<string, number> = new Map<string, number>();
    let counter: number = 0;
    Object.keys(data)
        .reduce((elements, key) => elements.concat(data[key]), [])
        .forEach((element) => {
          if (!topics.has(element.title)) {
            topics.set(element.title, counter);
            counter++;
          }
        });
    console.log(topics);
    return topics;
  }

  /**
   * Creates the columns forthe chart.
   */
  private createColumnNames(topics: Map<string, number>): void {
    this.columnNames = [];
    this.columnNames.push(COLUMN_TOPIC);

    // No topics gor these restricsions.
    if (topics.size === 0) {
      this.columnNames[1] = 'NO TOPICS FOUND';
      return;
    }

    // Sort map according values in rising order.
    topics = new Map([...topics.entries()].sort((a, b) => a[1] - b[1]));
    [...topics.keys()].forEach(
        (key) => this.columnNames.push(...[key, TOOLTIP_ROLE, STYLE_ROLE]));
    console.log(this.columnNames);
  }

  /**
   * Creates the data for the charts.
   */
  private createData(topics: Map<string, number>): void {
    this.data = [];
    Object.keys(this.trendsData).forEach((date) => {
      const row = Array((topics.size * NUM_OF_COL_PER_TOPIC) + 1).fill('');
      this.initializeRowArray(row);
      row[0] = date;
      if (topics.size === 0) {
        row[1] = 0;
      } else {
        [...this.trendsData[date]].forEach((element) => {
          let index = topics.get(element.title) * NUM_OF_COL_PER_TOPIC;
          const indexColor = topics.get(element.title);
          row[++index] = element.value;
          row[++index] = element.description;
          row[++index] = this.coloresService.lightColors[indexColor];
        });
      }
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

  /**
   * Changes trends data property when it recognized change in parent component.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trendsData']) {
      this.trendsData = changes['trendsData'].currentValue;
      console.log(this.trendsData);
      this.convertDataToChartsFormat();
      this.progress.emit(false);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.options = {
      width: 3 * (window.innerWidth / 5),
      height: window.innerWidth / 4,
      legend: {position: 'top', maxLines: 3},
      bar: {groupWidth: '75%'},
      isStacked: true,
      colors: this.coloresService.lightColors,
      explorer: {actions: ['dragToZoom', 'rightClickToReset']},
    };
  }
}
