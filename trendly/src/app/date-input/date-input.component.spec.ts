import {DatePipe} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DateInputComponent} from './date-input.component';

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let fixture: ComponentFixture<DateInputComponent>;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule(
            {declarations: [DateInputComponent], providers: [DatePipe]})
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit start date', () => {
    spyOn(component.startSelected, 'emit');
    component.emitStartDate();
    expect(component.startSelected.emit).toHaveBeenCalled();
  });

  it('should emit end date', () => {
    spyOn(component.endSelected, 'emit');
    component.emitEndDate();
    expect(component.endSelected.emit).toHaveBeenCalled();
  })
});
