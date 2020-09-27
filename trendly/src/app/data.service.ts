import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const START_PARAMETERS = '?';
const NEXT_PARAMETER = '&';
const TERM_PARAMETER = 'term=';
const START_DATE_PARAMETER = 'startDate=';
const END_DATE_PARAMETER = 'endDate=';
const COUNTRY_PARAMETER = 'country=';
const INTERVAL_PARAMETER = 'interval=';
const EMPTY_STR = '';
const TYPE_STRING = 'string';

/**
 * calls the servlets and returns the required data according to the given oarameters.
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private options = {observe: 'body' as const, responseType: 'json' as const};

  constructor(private http: HttpClient) { }

  /**
   * calls the required servlet with the given parameters and returns the response.
   * @param servletName 
   * @param term 
   * @param startDate 
   * @param endDate 
   * @param country 
   * @param interval 
   */
  public callServlet(servletName: string, term: string | string[], startDate : string, endDate: string, country: string, interval: number = 1) {
    let basrUrl : string = servletName + START_PARAMETERS;
    const url = basrUrl + this.buildURLParameters(term, startDate, endDate, country, interval)
    return this.http.get(url, this.options);
  }

  /**
   * returns the parameters url part.
   * @param term 
   * @param startDate 
   * @param endDate 
   * @param country 
   * @param interval 
   */
  buildURLParameters(term: string | string[], startDate : string, endDate: string, country: string, interval: number) : string {
    const termParameter : string = this.makeTermParameter(term);
    const dateParameter : string = START_DATE_PARAMETER + startDate + NEXT_PARAMETER + END_DATE_PARAMETER + endDate + NEXT_PARAMETER;
    const countryParameter : string = COUNTRY_PARAMETER + country + NEXT_PARAMETER;
    const intervalParameter : string = INTERVAL_PARAMETER + interval;

    return termParameter + dateParameter + countryParameter + intervalParameter;
  }

  /**
   * returns the term parameter part of the url.
   * @param term 
   */
  private makeTermParameter(term: string | string[]) : string {
    if (typeof term === TYPE_STRING) {
      return TERM_PARAMETER + term + NEXT_PARAMETER;
    }

    let terms : string = EMPTY_STR;
    for (let str of term) {
      terms += TERM_PARAMETER + str + NEXT_PARAMETER;
    }
    return terms;
  }
}
