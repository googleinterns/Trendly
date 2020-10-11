import {DatePipe} from '@angular/common';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {InputsComponent} from './histogramy-inputs.component';

const IL_COUNTRY: string = 'IL';
const CHANGED_INTERVAL: number = 2;
const CHANGED_END_DATE: string = '2006-01';
const MOCK_END_DATE: string = '2020-01';
const DEF_OBJ = {
  term: '',
  startDate: '2004-01',
  endDate: MOCK_END_DATE,
  country: '',
  interval: 1
};
const CHANGED_OBJ = {
  term: '',
  startDate: '2004-01',
  endDate: CHANGED_END_DATE,
  country: IL_COUNTRY,
  interval: CHANGED_INTERVAL
}

describe('InputsComponent', () => {
  let component: InputsComponent;
  let fixture: ComponentFixture<InputsComponent>;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule(
            {declarations: [InputsComponent], providers: [DatePipe]})
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsComponent);
    component = fixture.componentInstance;
    component.endDate = MOCK_END_DATE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on click with default', () => {
    spyOn(component.apply, 'emit');
    component.sendParameters();
    expect(component.apply.emit).toHaveBeenCalled();
    expect(component.apply.emit).toHaveBeenCalledWith(DEF_OBJ);
  });

  it('should emit on click with changed value', () => {
    component.country = 'IL';
    component.endDate = '2006-01';
    component.interval = 2;
    spyOn(component.apply, 'emit');
    component.sendParameters();
    expect(component.apply.emit).toHaveBeenCalled();
    expect(component.apply.emit).toHaveBeenCalledWith(CHANGED_OBJ);
  });

  it('should be invalide - start date after end date', () => {
    component.startDate = '2010-01';
    component.endDate = '2006-01';
    expect(!(component as any).dateValidity()).toBeTruthy();
  });

  it('should be invalide - wrong date format', () => {
    component.startDate = '2010/01/03';
    expect(!(component as any).dateValidity()).toBeTruthy();
  });

  it('should be invalide - negative interval', () => {
    component.interval = -1;
    expect(!(component as any).intervalValidity()).toBeTruthy();
  });

  it('should be invalide - decimal interval', () => {
    component.interval = 3.4;
    expect(!(component as any).intervalValidity()).toBeTruthy();
  });

  it('should be invalide - country not from the list', () => {
    component.country = 'wonderland';
    expect(!(component as any).countryValidity()).toBeTruthy();
  });
});
