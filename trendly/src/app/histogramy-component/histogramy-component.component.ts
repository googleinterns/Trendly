import {SelectionModel} from '@angular/cdk/collections';
import {Component} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {forkJoin, Observable} from 'rxjs';
import {DataService} from '../data.service';

interface InputObj {
  startDate: string;
  endDate: string;
  term: string;
  country: string;
  interval: number;
  category: string;
}

interface Topic {
  title: string;
  value: number;
  mid: string;
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

/**
 * Histogramy feature component.
 */
@Component({
  selector: 'app-histogramy-component',
  templateUrl: './histogramy-component.component.html',
  styleUrls: ['./histogramy-component.component.css']
})
export class HistogramyComponentComponent {
  readonly topTopicsTitle: string = 'Top Topics';
  readonly risingTopicsTitle: string = 'Rising Topics';
  readonly areaChartType: string = 'AreaChart';
  readonly columnChartType: string = 'ColumnChart';
  readonly lineChartType: string = 'LineChart';
  readonly topicsBatchingSize = 8;
  whichTop: number = 0;
  whichRising: number = 1;
  showMatProgress: boolean = true;
  // Topics lists.
  risingTopics;
  topTopics;
  // Mid maps to [topic, graph].
  allTopData: Map<string, (Topic | GraphSection)[]> = new Map();
  allRisingData: Map<string, (Topic | GraphSection)[]> = new Map();
  // Table's data source.
  dataSourceTop: MatTableDataSource<Topic> = new MatTableDataSource();
  dataSourceRising: MatTableDataSource<Topic> = new MatTableDataSource();
  // Selections data structures.
  readonly selectionTop: SelectionModel<Topic> =
      new SelectionModel<Topic>(true, []);
  readonly selectionRising: SelectionModel<Topic> =
      new SelectionModel<Topic>(true, []);
  readonly displayedColumns: string[] = ['select', 'title'];
  // Data for charts (topic + graph).
  topForHistogramSection: Map<Topic, GraphSection>;
  risingForHistogramSection: Map<Topic, GraphSection>;
  tab: number = 0;

  constructor(private dataService: DataService) {
    const defaultDates: string[] = this.getDefaultDates();
    const defaultInput = {
      term: '',
      startDate: defaultDates[0],
      endDate: defaultDates[1],
      country: '',
      interval: 1,
      category: '0'
    };
    this.getDataFromServer(defaultInput);
  }

  /**
   * Returns default dates (one year back).
   */
  private getDefaultDates(): string[] {
    let end: Date = new Date();
    let month: string = '' + end.getMonth();
    month = month.length === 1 ? '0' + month : month;
    let yearEnd = '' + end.getFullYear();
    let yearStart = '' + (end.getFullYear() - 1)
    return [yearStart + '-' + month, yearEnd + '-' + month];
  }

  /**
   * Gets data from server according to the given parameters.
   */
  getDataFromServer(input: InputObj): void {
    this.initializeGettingDataProcess();
    // Extracting topics.
    this.callServletForTopics(
            input['term'], input['startDate'], input['endDate'],
            input['country'], input['interval'], input['category'])
        .subscribe(
            (res) => {
              this.topTopics = Object.values({...res.topTopics});
              this.risingTopics = Object.values({...res.risingTopics});

              this.dataSourceTop = new MatTableDataSource(this.topTopics);
              this.dataSourceRising = new MatTableDataSource(this.risingTopics);

              // Fetching the topics graphs in batches.
              let current = 0;
              while (this.moreToFetch(current)) {
                const newTopTopics = this.topTopics.slice(
                    current, current + this.topicsBatchingSize);
                const newRisingTopics = this.risingTopics.slice(
                    current, current + this.topicsBatchingSize);

                if (newTopTopics.length > 0) {
                  this.callServlet(
                      input['term'], input['startDate'], input['endDate'],
                      input['country'], input['interval'], input['category'],
                      'topTopics', newTopTopics);
                }
                if (newRisingTopics.length > 0) {
                  this.callServlet(
                      input['term'], input['startDate'], input['endDate'],
                      input['country'], input['interval'], input['category'],
                      'risingTopics', newRisingTopics);
                }
                current += this.topicsBatchingSize;
              }
            },
            (err) => {
              console.log(err);
              alert(
                  'an error occurred while processing your request. please try again.')
            });
  }

  /**
   * Initiallizes all the relevant parameters for the process of fetching the
   * data.
   */
  private initializeGettingDataProcess(): void {
    this.showMatProgress = true;
    this.topForHistogramSection = new Map();
    this.risingForHistogramSection = new Map();
    this.selectionRising.clear();
    this.selectionTop.clear();
    this.allRisingData = new Map();
    this.allTopData = new Map();
  }

  /**
   *Checks whether there are still data to fetch. (stop condition for the
   *fetching loop).
   */
  private moreToFetch(current: number): boolean {
    return this.allRisingData && this.allTopData &&
        current <= Math.max(this.risingTopics.length, this.topTopics.length);
  }

  /**
   * Calls Histogramy servlet for initializing the topics lists.
   */
  private callServletForTopics(
      term: string, startDate: string, endDate: string, country: string,
      interval: number,
      category: string): Observable<{topTopics: Object, risingTopics: Object}> {
    return forkJoin({
      topTopics: this.dataService.fetchHistograsmyData(
          term, startDate, endDate, country, interval, category, 'topTopics'),
      risingTopics: this.dataService.fetchHistograsmyData(
          term, startDate, endDate, country, interval, category, 'risingTopics',
          [])
    });
  }
  /**
   *
   Calls servlet for fetching the topics and graphs data.
   */
  private callServlet(
      term: string, startDate: string, endDate: string, country: string,
      interval: number, category: string, funcName: string,
      topics?: Topic[]): void {
    this.dataService
        .fetchHistograsmyData(
            term, startDate, endDate, country, interval, category, funcName,
            topics)
        .subscribe(
            (data) => {
              const newData = {...data};
              if (funcName === 'topTopics') {
                Object.values(newData).forEach((val) => {
                  this.allTopData.set(val[0].mid, [val[0], val[1]]);
                });
              } else {
                Object.values(newData).forEach((val) => {
                  this.allRisingData.set(val[0].mid, [val[0], val[1]]);
                });
              }
              console.log(this.allTopData);
            },
            (err) => {
              console.log(err, topics);
              this.batchErrorHandler(funcName, topics);
            });
  }

  /**
   * Filters the data for the sidenav tables in case of an error in one of the
   * batches fetching.
   */
  private batchErrorHandler(funcName: string, topics: Topic[]): void {
    if (funcName === 'topTopics') {
      this.dataSourceTop.filterPredicate = (data, filter: string) => {
        return !topics.includes(data);
      };
      this.dataSourceTop.filter = '';
    } else {
      this.dataSourceRising.filterPredicate = (data, filter: string) => {
        return !topics.includes(data);
      };
      this.dataSourceRising.filter = '';
    }
  }

  /**
   * Updates the top topics selections after a topic selected / unselected.
   */
  toggleTop(topic: Topic) {
    this.selectionTop.toggle(topic);
    this.topForHistogramSection = new Map();
    this.selectionTop.selected.forEach((topic) => {
      this.topForHistogramSection.set(
          (this.allTopData.get(topic.mid)[0] as Topic),
          (this.allTopData.get(topic.mid)[1] as GraphSection));
    });
  }

  /**
   * Updates the rising topics selections after a topic selected / unselected.
   */
  toggleRising(topic: Topic) {
    this.selectionRising.toggle(topic);
    this.risingForHistogramSection = new Map();
    this.selectionRising.selected.forEach((topic) => {
      this.risingForHistogramSection.set(
          (this.allRisingData.get(topic.mid)[0] as Topic),
          (this.allRisingData.get(topic.mid)[1] as GraphSection));
    });
  }

  /**
   * Changes tab parameter according to the tab was chosen by the user.
   */
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tab = tabChangeEvent.index;
  }

  /**
   * Changes the progress bar (which indicates whether data is loadding).
   */
  changeProgress(progress: boolean): void {
    this.showMatProgress = progress;
  }
}
