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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initial countryValue should be match', waitForAsync(() => {
       fixture.whenStable().then(() => {
         const el = input.nativeElement;
         expect(el.value).toBe(EMPTY_STR);
       });
     }));

  it('should emit on change default', () => {
    spyOn(component.countrySelected, 'emit');
    component.emitCountry();
    expect(component.countrySelected.emit).toHaveBeenCalled();
    expect(component.countrySelected.emit).toHaveBeenCalledWith(EMPTY_STR);
  });
});
