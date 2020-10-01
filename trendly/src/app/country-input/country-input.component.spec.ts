import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {By} from '@angular/platform-browser';

import {CountryInputComponent} from './country-input.component';

const INPUT_ELEMENT: string = 'input';
const EMPTY_STR: string = '';
const COUNTRY1 = 'United State'
const COUNTRY2 = 'Venezuela';
const COUNTRY1_CODE = 'US';
const COUNTRY2_CODE = 'VE';

describe('CountryInputComponent', () => {
  let component: CountryInputComponent;
  let fixture: ComponentFixture<CountryInputComponent>;
  let input;
  let options;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          imports: [MatAutocompleteModule],
          declarations: [CountryInputComponent]
        })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryInputComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css(INPUT_ELEMENT));
    fixture.detectChanges();
  });

  /**
   * tets component creation.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * tests the initialized value of the term.
   */
  it('initial countryValue should be match', waitForAsync(() => {
       fixture.whenStable().then(() => {
         const el = input.nativeElement;

         expect(el.value).toBe(EMPTY_STR);
       });
     }));

  /**
   * tests emitter - should emit on change with default value.
   */
  it('should emit on change default', () => {
    spyOn(component.emitter, 'emit');
    component.emitCountry();
    expect(component.emitter.emit).toHaveBeenCalled();
    expect(component.emitter.emit).toHaveBeenCalledWith(EMPTY_STR);
  });

  /**
   * tests emitter - should emit and update on change with empty string.
   */
  it('should update and emit on change with empty str', () => {
    spyOn(component.emitter, 'emit');
    component.updateAndemitCountry(EMPTY_STR);
    expect(component.emitter.emit).toHaveBeenCalled();
    expect(component.emitter.emit).toHaveBeenCalledWith(EMPTY_STR);
  });

  /**
   * tests emitter - should emit and update on change with an exist country.
   */
  it('should emit and update on change', () => {
    spyOn(component.emitter, 'emit');
    component.updateAndemitCountry(COUNTRY2);
    expect(component.emitter.emit).toHaveBeenCalled();
    expect(component.emitter.emit).toHaveBeenCalledWith(COUNTRY2_CODE);
  });
});
