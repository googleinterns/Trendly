import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputObj} from '../clusterly-inputs/clusterly-inputs.component';
import {ClusterlyComponent} from './clusterly.component';

const INPUTS: InputObj = {
  startDate: '2014-01',
  endDate: '2020-10',
  terms: [''],
  country: 'US',
  category: '0',
};

describe('ClusterlyComponent', () => {
  let component: ClusterlyComponent;
  let fixture: ComponentFixture<ClusterlyComponent>;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [ClusterlyComponent],
          imports: [HttpClientTestingModule]
        })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get valid data from server', () => {
    component.getDataFromServer(INPUTS)
    expect(component.dataFromServer).toBeDefined();
  });
});
