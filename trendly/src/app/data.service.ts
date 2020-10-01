import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

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
 * Calls the servlets and returns the required data according to the given
 * oarameters.
 */
@Injectable({providedIn: 'root'})
export class DataService {
  private options = {observe: 'body' as const, responseType: 'json' as const};

  constructor(private http: HttpClient) {}

  /**
   * Calls the required servlet with the given parameters and returns the
   * response.
   * @param servletName
   * @param term
   * @param startDate
   * @param endDate
   * @param country
   * @param interval
   */
  public callServlet(
      servletName: string, term: string|string[], startDate: string,
      endDate: string, country: string, interval: number = 1) {
    let basrUrl: string = servletName + START_PARAMETERS;
    const url = basrUrl +
        this.buildURLParameters(term, startDate, endDate, country, interval)
    return this.http.get(url, this.options);
  }

  /**
   * Returns the parameters url part.
   * @param termOrTerms
   * @param startDate
   * @param endDate
   * @param country
   * @param interval
   */
  buildURLParameters(
      termOrTerms: string|string[], startDate: string, endDate: string,
      country: string, interval: number): string {
    const termParameter: string = this.makeTermParameter(termOrTerms);
    console.log(termParameter);
    const dateParameter: string = START_DATE_PARAMETER + startDate +
        NEXT_PARAMETER + END_DATE_PARAMETER + endDate + NEXT_PARAMETER;
    const countryParameter: string =
        COUNTRY_PARAMETER + country + NEXT_PARAMETER;
    const intervalParameter: string = INTERVAL_PARAMETER + interval;

    return termParameter + dateParameter + countryParameter + intervalParameter;
  }

  /**
   * Returns the term parameter part of the url.
   * @param termOrTerms
   */
  private makeTermParameter(termOrTerms: string|string[]): string {
    const wrapTerm: (term: string) => string = (term) =>
        TERM_PARAMETER + term + NEXT_PARAMETER;
    return typeof termOrTerms === TYPE_STRING ?
        wrapTerm(termOrTerms as string) :
        [...termOrTerms].reduce(
            (terms, term) => terms += wrapTerm(term), EMPTY_STR);
  }
}
