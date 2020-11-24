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
  readonly filteredCol: Map<number, number[]> = new Map<number, number[]>();

  constructor(private coloresService: ColorsService) {}

  ngOnInit(): void {
    this.changeChartOptions();
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
  private changeChartOptions(
      colors: string[] = this.coloresService.lightColors): void {
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
    this.colChangeHelper('#A9A9A9', col, false);
  }

  /**
   * Restores the given column to the chart's data and updates the charts
   * options accordingly.
   */
  private restoreCol(col: number): void {
    const newColor: string =
        this.coloresService.lightColors[(col - 1) / NUM_OF_COL_PER_TOPIC];
    this.colChangeHelper(newColor, col, true);
  }

  /**
   * Make the required change on the given column(restore or remove). Then
   * updates the data and the colors property in the options in order to apply
   * the changes in yhe UI.
   */
  private colChangeHelper(color: string, col: number, isRestore: boolean):
      void {
    let index: number = 0;
    this.data.forEach((val, key) => {
      !isRestore ? this.filteredCol.get(col).push(val[col] as number) : null;
      val[col] = isRestore ? this.filteredCol.get(col)[index++] : 0;
      val[col + 2] = color;
    });
    this.data = Object.assign([], this.data);
    const colors: string[] = Object.assign([], this.options['colors']);
    colors[(col - 1) / NUM_OF_COL_PER_TOPIC] = color;
    this.changeChartOptions(colors);
  }
}
