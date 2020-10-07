import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {TermInputComponent} from './term-input.component';

const INPUT_ELEMENT: string = 'input';
const EMPTY_STR: string = '';
const TERM1: string = 'corona';
const TERM2: string = 'apple';

describe('TermInputComponent', () => {
  let component: TermInputComponent;
  let fixture: ComponentFixture<TermInputComponent>;
  let input;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule(
            {imports: [FormsModule], declarations: [TermInputComponent]})
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermInputComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css(INPUT_ELEMENT));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('initial termValue should be match', waitForAsync(() => {
       fixture.whenStable().then(() => {
         let el = input.nativeElement;

         expect(el.value).toBe(EMPTY_STR);
       });
     }));

  it('termValue should be match after changing', waitForAsync(() => {
       fixture.whenStable().then(() => {
         let el = input.nativeElement;

         el.value = TERM1;
         el.dispatchEvent(new Event(INPUT_ELEMENT));
         expect(fixture.componentInstance.termValue).toBe(TERM1);

         el.value = TERM2;
         el.dispatchEvent(new Event(INPUT_ELEMENT));
         expect(fixture.componentInstance.termValue).toBe(TERM2);
       });
     }));

  it('should emit on change default', () => {
    spyOn(component.termSelected, 'emit');
    component.emitTerm();
    expect(component.termSelected.emit).toHaveBeenCalled();
    expect(component.termSelected.emit).toHaveBeenCalledWith(EMPTY_STR);
  });

  it('should emit on change', waitForAsync(() => {
       fixture.whenStable().then(() => {
         let el = input.nativeElement;

         el.value = TERM1;
         el.dispatchEvent(new Event(INPUT_ELEMENT));
         spyOn(component.termSelected, 'emit');
         component.emitTerm();
         expect(component.termSelected.emit).toHaveBeenCalled();
         expect(component.termSelected.emit).toHaveBeenCalledWith(TERM1);
       });
     }));
});
