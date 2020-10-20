import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {DataService} from './data.service';

export interface Topic {
  name: string;
  volume: number;
  description: string;
}

export interface DataType {
  [index: string]: Array<Topic>;
}

describe('DataService', () => {
  let service: DataService;

  beforeEach(
      () => TestBed.configureTestingModule(
          {imports: [HttpClientTestingModule], providers: [DataService]}));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return object with keys of type string', () => {
    let result;
    (service as any)
        .fetchTopTopics('term', '9/2010', '10/2010', 'US', 3)
        .subscribe((data) => {
          result = {...data};
        });
    for (let key in Object.keys(result)) {
      expect(typeof (key) === 'string').toBeTruthy();
    }
  });

  it('should change url according the parameters(list of terms)', () => {
    const url =
        (service as any)
            .buildURLParameters(['a', 'b', 'c'], '10 2010', '11 2011', 'US', 3);
    const expectedUrl =
        'term=a&term=b&term=c&startDate=10 2010&endDate=11 2011&country=US&interval=3';
    expect(url).toEqual(expectedUrl);
  });

  it('should change url according the parameters(single term)', () => {
    const url =
        (service as any)
            .buildURLParameters('corona', '10 2010', '11 2011', 'US', 3);
    const expectedUrl =
        'term=corona&startDate=10 2010&endDate=11 2011&country=US&interval=3';
    expect(url).toEqual(expectedUrl);
  });
});
