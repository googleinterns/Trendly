import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {By} from "@angular/platform-browser";

import { IntervalInputComponent } from './interval-input.component';

const INPUT_ELEMENT : string = 'input';
const EMPTY_STR : string = '';
const VAL1_STR : string= '1';
const VAL2_STR : string = '2';
const VAL1 : number = 1;
const VAL2 : number = 2;

describe('IntervalInputComponent', () => {
  let component: IntervalInputComponent;
  let fixture: ComponentFixture<IntervalInputComponent>;
  let input;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervalInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalInputComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css(INPUT_ELEMENT));
    fixture.detectChanges();
  });

  /**
   * tests component creation.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * tests the initialized value of the term.
   */
  it('initial intervalValue should be match', waitForAsync(() => {

    fixture.whenStable().then(() => {
      let el = input.nativeElement;

      expect(el.value).toBe(EMPTY_STR);
    });
  }));


  /**
   * tests emitter - should emit on change with default value.
   */
  it('should emit on change default', () => {
    spyOn(component.emitter, 'emit');
    component.emitInterval();
    expect(component.emitter.emit).toHaveBeenCalled();
    expect(component.emitter.emit).toHaveBeenCalledWith(VAL1);
  });
});
