import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputsComponent } from './inputs.component';

const IL_COUNTRY : string = 'IL';
const CHANGED_INTERVAL : number = 2;
const CHANGED_END_DATE : Date = new Date(2006, 1, 1);
const MOCK_END_DATE : Date = new Date(2020, 1, 1);
const DEF_OBJ = {
  term:'',
  startDate: new Date(2004, 1, 1),
  endDate: MOCK_END_DATE,
  country: '',
  interval: 1
}
const CHANGED_OBJ = {
  term:'',
  startDate: new Date(2004, 1, 1),
  endDate: CHANGED_END_DATE,
  country: IL_COUNTRY,
  interval: CHANGED_INTERVAL
}

describe('InputsComponent', () => {
  let component: InputsComponent;
  let fixture: ComponentFixture<InputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsComponent);
    component = fixture.componentInstance;
    component.endDate = MOCK_END_DATE;
    fixture.detectChanges();
  });

  /**
   * tests component creation.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * tests emitter - should emit on click with default values.
   */
  it('should emit on click with default', () => {
    spyOn(component.apply, 'emit');
    component.sendParameters();
    expect(component.apply.emit).toHaveBeenCalled();
    expect(component.apply.emit).toHaveBeenCalledWith(DEF_OBJ);
   
  });

  /**
   * tests emitter - should emit on click with after changed values.
   */
  it('should emit on click with default', () => {
    component.country = 'IL';
    component.endDate = new Date(2006, 1, 1);
    component.interval = 2;
    spyOn(component.apply, 'emit');
    component.sendParameters();
    expect(component.apply.emit).toHaveBeenCalled();
    expect(component.apply.emit).toHaveBeenCalledWith(CHANGED_OBJ);
  });
});
