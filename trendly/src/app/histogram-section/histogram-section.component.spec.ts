import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramSectionComponent } from './histogram-section.component';
const DATA1 : Object  = {
  '8/2010' : [{name: 'apple', volume: 50, description:'big tech company'}, {name: 'corona', volume: 50, description:'a dangerous virus'}],
  '9/2010' : [{name: 'apple', volume: 30, description:'big tech company'}, {name: 'elections', volume: 10, description:'elections'}, {name: 'corona', volume: 80, description:'a dangerous virus'}],
  '10/2010' : [{name: 'elections', volume: 80, description:'elections'}, {name: 'corona', volume: 100, description:'a dangerous virus'}, 
  {name: 'pizza', volume: 20, description:'very tasty food'}],
}
const DATA2 = {
  '8/2010' : [{name: 'food', volume: 40, description:'yummy'}, {name: 'corona', volume: 50, description:'a dangerous virus'}],
  '9/2010' : [{name: 'ninja', volume: 30, description:'kitchen instrument'}, {name: 'elections', volume: 10, description:'elections'}, {name: 'corona', volume: 80, description:'a dangerous virus'}],
  '10/2010' : [{name: 'elections', volume: 80, description:'elections'}, {name: 'corona', volume: 100, description:'a dangerous virus'}, 
  {name: 'pizza', volume: 20, description:'very tasty food'}],
}
const EXPECT_OUTPUT = [["8/2010", 50, "big tech company", "#64B5F6", 50, "a dangerous virus", "#9575CD", 0, "", "", 0, "", ""],
["9/2010", 30, "big tech company", "#64B5F6", 80, "a dangerous virus", "#9575CD", 10, "elections", "#4DB6AC", 0, "", ""],
["10/2010", 0, "", "", 100, "a dangerous virus", "#9575CD", 80, "elections", "#4DB6AC", 20, "very tasty food", "#FFB74D"]];
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
    await TestBed.configureTestingModule({
      declarations: [ HistogramSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * tests component creation.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * tests extract topics given data1.
   */
  it('test extract topics 1', () => {
    let topics : Map<string, number> = new Map<string, number>();
    topics.set(TERM2, 0);
    topics.set(TERM1, 1);
    topics.set(TERM3, 2);
    topics.set(TERM4, 3);

    expect(fixture.componentInstance.extractTopics(DATA1)).toEqual(topics);
  });

  /**
   * tests extract topics given data2.
   */
  it('test extract topics 2', () => {
    let topics : Map<string, number> = new Map<string, number>();
    topics.set(TERM5, 0);
    topics.set(TERM1, 1);
    topics.set(TERM6, 2);
    topics.set(TERM3, 3);
    topics.set(TERM4, 4);
  
    expect(fixture.componentInstance.extractTopics(DATA2)).toEqual(topics);
  });

  /**
   * tests coulumn creation.
   */
  it('test creat coulumns', () => {
    let topics : Map<string, number> = new Map<string, number>();
    topics.set(TERM5, 0);
    topics.set(TERM1, 1);
    topics.set(TERM6, 2);
    topics.set(TERM3, 3);
    topics.set(TERM2, 4);

    let columns = ['Topic', TERM5, {role: 'tooltip'}, {role: 'style'},TERM1, {role: 'tooltip'}, {role: 'style'}, TERM6, {role: 'tooltip'}, 
    {role: 'style'},TERM3, {role: 'tooltip'}, {role: 'style'}, TERM2, {role: 'tooltip'}, {role: 'style'}];
    fixture.componentInstance.createColumnNames(topics);
    expect(fixture.componentInstance.columnNames).toEqual(columns);
  });

  /**
   * tests the output of the component given the mock data.
   */
  it('test output of the component given the mock data', () => {
    fixture.componentInstance.convertDataToChartsFormat();
    expect(fixture.componentInstance.data).toEqual(EXPECT_OUTPUT);
  });
});
