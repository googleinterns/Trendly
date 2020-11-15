import {Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges} from '@angular/core';
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

interface Point {
  value: number;
  date: string;
}

interface GraphSection {
  term: string;
  points: Point[]
}

interface DataValueType {
  lines: GraphSection[]
}

// TODO: remove mocks
const topic1: Topic = {
  title: 'elections',
  value: 80,
  description: 'elections'
};
const topic2: Topic = {
  title: 'corona',
  value: 100,
  description: 'a dangerous virus'
};
const NEW_MOCK_DATA: Map<Topic, DataValueType> =
    new Map<Topic, DataValueType>();
NEW_MOCK_DATA.set(topic1, {
  'lines': [{
    'term': 'soccer',
    'points': [
      {'value': 15, 'date': '2010-01-03'}, {'value': 21, 'date': '2010-01-10'},
      {'value': 28, 'date': '2010-01-17'}, {'value': 27, 'date': '2010-01-24'},
      {'value': 20, 'date': '2010-01-31'}, {'value': 0, 'date': '2010-02-07'},
      {'value': 42, 'date': '2010-02-14'}, {'value': 28, 'date': '2010-02-21'},
      {'value': 20, 'date': '2010-02-28'}, {'value': 27, 'date': '2010-03-07'},
      {'value': 0, 'date': '2010-03-14'},  {'value': 27, 'date': '2010-03-21'},
      {'value': 30, 'date': '2010-03-28'}, {'value': 47, 'date': '2010-04-04'},
      {'value': 38, 'date': '2010-04-11'}, {'value': 13, 'date': '2010-04-18'},
      {'value': 20, 'date': '2010-04-25'}, {'value': 33, 'date': '2010-05-02'},
      {'value': 29, 'date': '2010-05-09'}, {'value': 58, 'date': '2010-05-16'},
      {'value': 50, 'date': '2010-05-23'}, {'value': 31, 'date': '2010-05-30'},
      {'value': 39, 'date': '2010-06-06'}, {'value': 35, 'date': '2010-06-13'},
      {'value': 33, 'date': '2010-06-20'}, {'value': 32, 'date': '2010-06-27'},
      {'value': 33, 'date': '2010-07-04'}, {'value': 44, 'date': '2010-07-11'},
      {'value': 43, 'date': '2010-07-18'}, {'value': 100, 'date': '2010-07-25'},
      {'value': 50, 'date': '2010-08-01'}, {'value': 45, 'date': '2010-08-08'},
      {'value': 36, 'date': '2010-08-15'}, {'value': 35, 'date': '2010-08-22'},
      {'value': 28, 'date': '2010-08-29'}, {'value': 34, 'date': '2010-09-05'},
      {'value': 33, 'date': '2010-09-12'}, {'value': 33, 'date': '2010-09-19'},
      {'value': 19, 'date': '2010-09-26'}, {'value': 20, 'date': '2010-10-03'},
      {'value': 13, 'date': '2010-10-10'}, {'value': 31, 'date': '2010-10-17'},
      {'value': 12, 'date': '2010-10-24'}, {'value': 24, 'date': '2010-10-31'},
      {'value': 18, 'date': '2010-11-07'}, {'value': 18, 'date': '2010-11-14'},
      {'value': 12, 'date': '2010-11-21'}, {'value': 43, 'date': '2010-11-28'},
      {'value': 37, 'date': '2010-12-05'}, {'value': 39, 'date': '2010-12-12'},
      {'value': 23, 'date': '2010-12-19'}, {'value': 59, 'date': '2010-12-26'},
      {'value': 29, 'date': '2011-01-02'}, {'value': 28, 'date': '2011-01-09'},
      {'value': 44, 'date': '2011-01-16'}, {'value': 11, 'date': '2011-01-23'},
      {'value': 38, 'date': '2011-01-30'}
    ]
  }]
});
NEW_MOCK_DATA.set(topic2, {
  'lines': [{
    'term': 'soccer',
    'points': [
      {'value': 15, 'date': '2010-01-03'}, {'value': 21, 'date': '2010-01-10'},
      {'value': 28, 'date': '2010-01-17'}, {'value': 27, 'date': '2010-01-24'},
      {'value': 20, 'date': '2010-01-31'}, {'value': 0, 'date': '2010-02-07'},
      {'value': 42, 'date': '2010-02-14'}, {'value': 28, 'date': '2010-02-21'},
      {'value': 20, 'date': '2010-02-28'}, {'value': 27, 'date': '2010-03-07'},
      {'value': 0, 'date': '2010-03-14'},  {'value': 27, 'date': '2010-03-21'},
      {'value': 30, 'date': '2010-03-28'}, {'value': 47, 'date': '2010-04-04'},
      {'value': 38, 'date': '2010-04-11'}, {'value': 13, 'date': '2010-04-18'},
      {'value': 20, 'date': '2010-04-25'}, {'value': 33, 'date': '2010-05-02'},
      {'value': 29, 'date': '2010-05-09'}, {'value': 58, 'date': '2010-05-16'},
      {'value': 50, 'date': '2010-05-23'}, {'value': 31, 'date': '2010-05-30'},
      {'value': 39, 'date': '2010-06-06'}, {'value': 35, 'date': '2010-06-13'},
      {'value': 33, 'date': '2010-06-20'}, {'value': 32, 'date': '2010-06-27'},
      {'value': 33, 'date': '2010-07-04'}, {'value': 44, 'date': '2010-07-11'},
      {'value': 43, 'date': '2010-07-18'}, {'value': 100, 'date': '2010-07-25'},
      {'value': 50, 'date': '2010-08-01'}, {'value': 45, 'date': '2010-08-08'},
      {'value': 36, 'date': '2010-08-15'}, {'value': 35, 'date': '2010-08-22'},
      {'value': 28, 'date': '2010-08-29'}, {'value': 34, 'date': '2010-09-05'},
      {'value': 33, 'date': '2010-09-12'}, {'value': 33, 'date': '2010-09-19'},
      {'value': 19, 'date': '2010-09-26'}, {'value': 20, 'date': '2010-10-03'},
      {'value': 13, 'date': '2010-10-10'}, {'value': 31, 'date': '2010-10-17'},
      {'value': 12, 'date': '2010-10-24'}, {'value': 24, 'date': '2010-10-31'},
      {'value': 18, 'date': '2010-11-07'}, {'value': 18, 'date': '2010-11-14'},
      {'value': 12, 'date': '2010-11-21'}, {'value': 43, 'date': '2010-11-28'},
      {'value': 37, 'date': '2010-12-05'}, {'value': 39, 'date': '2010-12-12'},
      {'value': 23, 'date': '2010-12-19'}, {'value': 59, 'date': '2010-12-26'},
      {'value': 29, 'date': '2011-01-02'}, {'value': 28, 'date': '2011-01-09'},
      {'value': 44, 'date': '2011-01-16'}, {'value': 11, 'date': '2011-01-23'},
      {'value': 38, 'date': '2011-01-30'}
    ]
  }]
});
const TOOLTIP_ROLE_NAME = 'tooltip';
const STYLE_ROLE_NAME = 'style';
const COLUMN_TOPIC = 'Topic';
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
export class HistogramSectionComponent implements OnInit {
  @Input() trendsData;
  @Input() title: string;
  @Input() type: string;
  @Input() data: Array<Array<string|number>> = [];
  @Input() columnNames: ColumnArray = [];
  @Input() options: object = {};
  @Output() progress = new EventEmitter<boolean>();
  private mapTrendsData: Map<Topic, DataValueType>;
  private filteredCol: Map<number, number[]> = new Map<number, number[]>();

  constructor(private coloresService: ColorsService) {}

  ngOnInit() {
    this.changeChartOptions();
    // TODO: for running without data - romove it.
    // this.mapTrendsData = NEW_MOCK_DATA;
    // this.convertDataToChartsFormat();
  }

  /**
   * Converts the data from the server to charts format.
   */
  convertDataToChartsFormat(): void {
    const topics: Map<string, number> = this.extractTopics(this.mapTrendsData);
    this.createColumnNames(topics);
    this.createData(topics);
  }

  /**
   * Extracts and returns the topics mapped to their index.
   */
  private extractTopics(data: Map<Topic, DataValueType>): Map<string, number> {
    const topics: Map<string, number> = new Map<string, number>();
    let counter: number = 0;
    [...data.keys()].forEach((topic) => {
      topics.set(topic.title, counter++);
    });
    console.log(topics);
    return topics;
  }

  /**
   * Creates the columns for the chart.
   */
  private createColumnNames(topics: Map<string, number>): void {
    this.columnNames = [];
    this.columnNames.push(COLUMN_TOPIC);
    // No topics for these restricsions.
    (topics.size === 0) ? this.columnNames[1] = 'NO TOPICS FOUND' : null;

    for (const key of topics.keys()) {
      this.columnNames.push(key, TOOLTIP_ROLE, STYLE_ROLE);
    }
    console.log(this.columnNames);
  }

  /**
   * Creates the data for the charts.
   */
  private createData(topics: Map<string, number>): void {
    this.data = [];
    if (topics.size !== 0) {
      for (let i = 0;
           i < this.mapTrendsData.values().next().value.lines[0].points.length;
           i++) {
        const row = Array((topics.size * NUM_OF_COL_PER_TOPIC) + 1).fill('');
        this.initializeRowArray(row);
        row[0] =
            this.mapTrendsData.values().next().value.lines[0].points[i].date;
        for (const [key, val] of this.mapTrendsData) {
          let index = topics.get(key.title) * NUM_OF_COL_PER_TOPIC;
          const indexColor = topics.get(key.title);
          row[++index] = val.lines[0].points[i].value;
          row[++index] = key.description;
          row[++index] = this.coloresService.lightColors[indexColor];
        }
        this.data.push(row);
      }
    } else {
      const row = Array(1).fill('');
      row[0] = '';
      row[1] = 0;
      this.data.push(row);
    }
    console.log(this.data);
  }

  /**
   * Initializes one row in the data.
   */
  private initializeRowArray(array: Array<string|number>): void {
    for (let i = 1; i < array.length; i += NUM_OF_COL_PER_TOPIC) {
      array[i] = 0;
    }
  }

  /**
   * Converts trend data variable to map (topics mapped to their graph objects
   * from trends API)
   */
  private convrtTrendsDataToMap(): void {
    this.mapTrendsData = new Map<Topic, DataValueType>();
    for (let i = 0; i < Object.keys(this.trendsData).length; i++) {
      this.mapTrendsData.set(this.trendsData[i][0], this.trendsData[i][1]);
    }
  }

  /**
   * Changes trends data property when it recognized change in parent component.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trendsData']) {
      // this.trendsData = changes['trendsData'].currentValue;
      console.log(this.trendsData);
      this.filteredCol.clear();
      this.changeChartOptions();
      this.convrtTrendsDataToMap();
      this.convertDataToChartsFormat();
      this.progress.emit(false);
    }
  }

  /**
   * Changes the chart options property when needed (screen resize / filter
   * columns / chnage data).
   */
  @HostListener('window:resize')
  private changeChartOptions(colors: string[] = this.coloresService.lightColors) : void {
    this.options = {
      curveType: 'function',
      width: 3 * (window.innerWidth / 5),
      height: window.innerWidth / 4,
      legend: {position: 'top', maxLines: 3},
      bar: {groupWidth: '75%'},
      isStacked: true,
      colors: colors,
      explorer: {actions: ['dragToZoom', 'rightClickToReset']},
    };
  }

  /**
   * Filters the chart columns according the user selection.
   * @param event - a given user click on the chart's topics event.
   */
  onSelect(event): void {
    console.log(event);
    if (event['selection'][0].row === null) {
      const col = event['selection'][0].column;
      if (this.filteredCol.has(col)) {
        this.restoreCol(col);
        this.filteredCol.delete(col);
      } else {
        this.filteredCol.set(col, []);
        this.removeCol(col);
      }
    }
  }

  /**
   * Removes the given column from the data and updates the charts options
   * accordingly.
   */
  private removeCol(col: number): void {
    this.data.forEach((val, key) => {
      this.filteredCol.get(col).push(val[col] as number);
      val[col] = 0;
      val[col + 2] = '#A9A9A9';
    });
    this.data = Object.assign([], this.data);
    const colors: string[] = Object.assign([], this.options['colors']);
    colors[(col - 1) / NUM_OF_COL_PER_TOPIC] = '#A9A9A9';
    this.changeChartOptions(colors);
  }

  /**
   * Restores the given column to the chart's data and updates the charts
   * options accordingly.
   */
  private restoreCol(col: number) {
    let index: number = 0;
    const newColor: string =
        this.coloresService.lightColors[(col - 1) / NUM_OF_COL_PER_TOPIC];
    this.data.forEach((val, key) => {
      val[col] = this.filteredCol.get(col)[index++];
      val[col + 2] = newColor;
    });
    this.data = Object.assign([], this.data);
    const colors: string[] = Object.assign([], this.options['colors']);
    colors[(col - 1) / NUM_OF_COL_PER_TOPIC] = newColor;
    this.changeChartOptions(colors);
  }
}
