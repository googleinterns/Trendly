import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HistogramSectionComponent} from './histogram-section.component';

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
    'term': 'elections',
    'points': [
      {'value': 15, 'date': '2010-01-03'}, {'value': 21, 'date': '2010-01-10'},
      {'value': 28, 'date': '2010-01-17'}, {'value': 27, 'date': '2010-01-24'},
      {'value': 20, 'date': '2010-01-31'}, {'value': 0, 'date': '2010-02-07'},
    ]
  }]
});
NEW_MOCK_DATA.set(topic2, {
  'lines': [{
    'term': 'corona',
    'points': [
      {'value': 15, 'date': '2010-01-03'}, {'value': 21, 'date': '2010-01-10'},
      {'value': 28, 'date': '2010-01-17'}, {'value': 27, 'date': '2010-01-24'},
      {'value': 20, 'date': '2010-01-31'}, {'value': 0, 'date': '2010-02-07'},
    ]
  }]
});

const EXPECT_OUTPUT: Array<Array<string|number>> = [
  [
    '2010-01-03', 15, 'elections', '#4ec3ff', 15, 'a dangerous virus',
    '#9467e4'
  ],
  [
    '2010-01-10', 21, 'elections', '#4ec3ff', 21, 'a dangerous virus',
    '#9467e4'
  ],
  [
    '2010-01-17', 28, 'elections', '#4ec3ff', 28, 'a dangerous virus', '#9467e4'
  ],
  [
    '2010-01-24', 27, 'elections', '#4ec3ff', 27, 'a dangerous virus',
    '#9467e4'
  ],
  [
    '2010-01-31', 20, 'elections', '#4ec3ff', 20, 'a dangerous virus',
    '#9467e4'
  ],
  [
    '2010-02-07', 0, 'elections', '#4ec3ff', 0, 'a dangerous virus', '#9467e4'
  ]
];

describe('HistogramSectionComponent', () => {
  let component: HistogramSectionComponent;
  let fixture: ComponentFixture<HistogramSectionComponent>;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({declarations: [HistogramSectionComponent]})
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramSectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test extract topics with data1', () => {
    const topics: Map<string, number> = new Map<string, number>();
    topics.set('elections', 0);
    topics.set('corona', 1);

    expect((component as any).extractTopics(NEW_MOCK_DATA)).toEqual(topics);
  });

  it('test creat coulumns', () => {
    const topics: Map<string, number> = new Map<string, number>();
    topics.set('elections', 0);
    topics.set('corona', 1);

    const columns = [
      'Topic', 'elections', {role: 'tooltip'}, {role: 'style'}, 'corona',
      {role: 'tooltip'}, {role: 'style'}
    ];
    (component as any).createColumnNames(topics);
    expect(component.columnNames).toEqual(columns);
  });

  it('test output of the component given the mock data', () => {
    (component as any).mapTrendsData = NEW_MOCK_DATA;
    component.convertDataToChartsFormat();
    expect(component.data).toEqual(EXPECT_OUTPUT);
  });
});
