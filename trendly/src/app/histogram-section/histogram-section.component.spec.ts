import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HistogramSectionComponent} from './histogram-section.component';

interface Topic {
  name: string, volume: number, description: string,
}
interface DataType {
  [index: string]: Array<Topic>;
}
const DATA1: DataType = {
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
const DATA2: DataType = {
  '8/2010': [
    {name: 'food', volume: 40, description: 'yummy'},
    {name: 'corona', volume: 50, description: 'a dangerous virus'}
  ],
  '9/2010': [
    {name: 'ninja', volume: 30, description: 'kitchen instrument'},
    {name: 'elections', volume: 10, description: 'elections'},
    {name: 'corona', volume: 80, description: 'a dangerous virus'}
  ],
  '10/2010': [
    {name: 'elections', volume: 80, description: 'elections'},
    {name: 'corona', volume: 100, description: 'a dangerous virus'},
    {name: 'pizza', volume: 20, description: 'very tasty food'}
  ],
};
const EXPECT_OUTPUT: Array<Array<string|number>> = [
  [
    '8/2010', 50, 'big tech company', '#64B5F6', 50, 'a dangerous virus',
    '#9575CD', 0, '', '', 0, '', ''
  ],
  [
    '9/2010', 30, 'big tech company', '#64B5F6', 80, 'a dangerous virus',
    '#9575CD', 10, 'elections', '#4DB6AC', 0, '', ''
  ],
  [
    '10/2010', 0, '', '', 100, 'a dangerous virus', '#9575CD', 80, 'elections',
    '#4DB6AC', 20, 'very tasty food', '#FFB74D'
  ]
];
const TERM1 = 'corona';
const TERM2 = 'apple';
const TERM3 = 'elections';
const TERM4 = 'pizza';
const TERM5 = 'food';
const TERM6 = 'ninja';

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
    topics.set(TERM2, 0);
    topics.set(TERM1, 1);
    topics.set(TERM3, 2);
    topics.set(TERM4, 3);

    expect(component.extractTopics(DATA1)).toEqual(topics);
  });

  it('test extract topics with data2', () => {
    const topics: Map<string, number> = new Map<string, number>();
    topics.set(TERM5, 0);
    topics.set(TERM1, 1);
    topics.set(TERM6, 2);
    topics.set(TERM3, 3);
    topics.set(TERM4, 4);
    expect(component.extractTopics(DATA2)).toEqual(topics);
  });

  it('test creat coulumns', () => {
    const topics: Map<string, number> = new Map<string, number>();
    topics.set(TERM5, 0);
    topics.set(TERM1, 1);
    topics.set(TERM6, 2);
    topics.set(TERM3, 3);
    topics.set(TERM2, 4);
    const columns = [
      'Topic', TERM5, {role: 'tooltip'}, {role: 'style'}, TERM1,
      {role: 'tooltip'}, {role: 'style'}, TERM6, {role: 'tooltip'},
      {role: 'style'}, TERM3, {role: 'tooltip'}, {role: 'style'}, TERM2,
      {role: 'tooltip'}, {role: 'style'}
    ];
    component.createColumnNames(topics);
    expect(component.columnNames).toEqual(columns);
  });

  it('test output of the component given the mock data', () => {
    component.trendsData = DATA1;
    component.convertDataToChartsFormat();
    expect(component.data).toEqual(EXPECT_OUTPUT);
  });
});
