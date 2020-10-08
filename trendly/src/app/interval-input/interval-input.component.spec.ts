import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {IntervalInputComponent} from './interval-input.component';

const INPUT_ELEMENT: string = 'input';
const EMPTY_STR: string = '';
const VAL1_STR: string = '1';
const VAL2_STR: string = '2';
const VAL1: number = 1;
const VAL2: number = 2;

describe('IntervalInputComponent', () => {
  let component: IntervalInputComponent;
  let fixture: ComponentFixture<IntervalInputComponent>;
  let input;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({declarations: [IntervalInputComponent]})
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalInputComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css(INPUT_ELEMENT));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initial intervalValue should be match', waitForAsync(() => {
       fixture.whenStable().then(() => {
         let el = input.nativeElement;

         expect(el.value).toBe(EMPTY_STR);
       });
     }));


  it('should emit on change default', () => {
    spyOn(component.intervalSelected, 'emit');
    component.emitInterval();
    expect(component.intervalSelected.emit).toHaveBeenCalled();
    expect(component.intervalSelected.emit).toHaveBeenCalledWith(VAL1);
  });
});
