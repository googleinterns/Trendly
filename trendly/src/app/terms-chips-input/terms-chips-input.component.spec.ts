import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';

import {TermsChipsInputComponent} from './terms-chips-input.component';


const TERM: string = 'check';
const ADD_EVENT: MatChipInputEvent = {
  input: null,
  value: TERM
};
const EMPTY_TERMS: string[] = [];

describe('TermsChipsInputComponent', () => {
  let component: TermsChipsInputComponent;
  let fixture: ComponentFixture<TermsChipsInputComponent>;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [TermsChipsInputComponent],
          imports: [MatChipsModule]
        })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsChipsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when a term is added', () => {
    spyOn(component.termsSelected, 'emit');
    component.add(ADD_EVENT);
    expect(component.termsSelected.emit).toHaveBeenCalled();
    expect(component.termsSelected.emit).toHaveBeenCalledWith([TERM]);
  });

  it('should emit when a term is removed', () => {
    spyOn(component.termsSelected, 'emit');
    component.terms = [TERM];
    component.remove(TERM);
    expect(component.termsSelected.emit).toHaveBeenCalled();
    expect(component.termsSelected.emit).toHaveBeenCalledWith(EMPTY_TERMS);
  });
});
