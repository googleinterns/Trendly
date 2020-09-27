import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

import { DataService } from './data.service';

export interface Topic {
  name: string; 
  volume : number; 
  description : string;
}

export interface DataType {
  [index: string]: Array<Topic>;
}

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule], 
    providers: [DataService]
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  /**
   * tests service creation
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * tests return value.
   */
  it('should return object with keys of type string', () => {
    let result;
    service.callServlet('/top-topics','term', '9/2010', '10/2010', 'US', 3).subscribe((data) => {
      result = { ...data };
     }
      );
    for (let key in Object.keys(result))
    {
      expect(typeof(key) === 'string').toBeTruthy();
    }
    
  });

  /**
   * tests url build.
   */
  it('should change url according the parameters(list of terms)', () => {
    const url = service.buildURLParameters(['a', 'b', 'c'], '10 2010', '11 2011', 'US', 3);
    const expectedUrl = 'term=a&term=b&term=c&startDate=10 2010&endDate=11 2011&country=US&interval=3';
    expect(url).toEqual(expectedUrl);
  });

  /**
   * tests url build.
   */
  it('should change url according the parameters(single term)', () => {
    const url = service.buildURLParameters('corona', '10 2010', '11 2011', 'US', 3);
    const expectedUrl = 'term=corona&startDate=10 2010&endDate=11 2011&country=US&interval=3';
    expect(url).toEqual(expectedUrl);
  });




});
