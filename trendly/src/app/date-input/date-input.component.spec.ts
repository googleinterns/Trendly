import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateInputComponent } from './date-input.component';

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let fixture: ComponentFixture<DateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateInputComponent);
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
   * tests start date emittion.
   */
  it('should emit start date', () => {
    spyOn(component.emitterStart, 'emit');
    component.emitStartDate();
    expect(component.emitterStart.emit).toHaveBeenCalled();
  });

  /**
   * tests end date emittion.
   */
  it('should emit start date', () => {
    spyOn(component.emitterEnd, 'emit');
    component.emitEndDate();
    expect(component.emitterEnd.emit).toHaveBeenCalled();
  })
});
