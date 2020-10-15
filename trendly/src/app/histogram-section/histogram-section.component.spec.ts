import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HistogramSectionComponent} from './histogram-section.component';

interface Topic {
  title: string;
  value: number;
  description: string;
}
interface DataType {
  [index: string]: Topic[];
}
const DATA1: DataType = {
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
const DATA2: DataType = {
  '8/2010': [
    {title: 'food', value: 40, description: 'yummy'},
    {title: 'corona', value: 50, description: 'a dangerous virus'}
  ],
  '9/2010': [
    {title: 'ninja', value: 30, description: 'kitchen instrument'},
    {title: 'elections', value: 10, description: 'elections'},
    {title: 'corona', value: 80, description: 'a dangerous virus'}
  ],
  '10/2010': [
    {title: 'elections', value: 80, description: 'elections'},
    {title: 'corona', value: 100, description: 'a dangerous virus'},
    {title: 'pizza', value: 20, description: 'very tasty food'}
  ],
};
const EXPECT_OUTPUT: Array<Array<string|number>> = [
  [
    '8/2010', 50, 'big tech company', '#4ec3ff', 50, 'a dangerous virus',
    '#9467e4', 0, '', '', 0, '', ''
  ],
  [
    '9/2010', 30, 'big tech company', '#4ec3ff', 80, 'a dangerous virus',
    '#9467e4', 10, 'elections', '#2dc3b5', 0, '', ''
  ],
  [
    '10/2010', 0, '', '', 100, 'a dangerous virus', '#9467e4', 80, 'elections',
    '#2dc3b5', 20, 'very tasty food', '#ffc52d'
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

    expect((component as any).extractTopics(DATA1)).toEqual(topics);
  });

  it('test extract topics with data2', () => {
    const topics: Map<string, number> = new Map<string, number>();
    topics.set(TERM5, 0);
    topics.set(TERM1, 1);
    topics.set(TERM6, 2);
    topics.set(TERM3, 3);
    topics.set(TERM4, 4);
    expect((component as any).extractTopics(DATA2)).toEqual(topics);
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
    (component as any).createColumnNames(topics);
    expect(component.columnNames).toEqual(columns);
  });

  it('test output of the component given the mock data', () => {
    component.trendsData = DATA1;
    component.convertDataToChartsFormat();
    expect(component.data).toEqual(EXPECT_OUTPUT);
  });
});
