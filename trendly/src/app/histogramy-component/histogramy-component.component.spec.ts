import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {DataService} from '../data.service';

import { HistogramyComponentComponent } from './histogramy-component.component';
const DEF_OBJ = {
  term:'',
  startDate: new Date(2004, 1, 1),
  endDate: new Date(2020, 1, 1),
  country: '',
  interval: 1
}
describe('HistogramyComponentComponent', () => {
  let component: HistogramyComponentComponent;
  let fixture: ComponentFixture<HistogramyComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistogramyComponentComponent ],
      imports: [HttpClientTestingModule],
      providers: [DataService]
  
    
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * tests component creation.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //TODO: after call to server add tests to see if its the expected value
});
