import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/**
 * Calls the servlets and returns the required data according to the given
 * parameters.
 */
@Injectable({providedIn: 'root'})
export class DataService {
  constructor(private http: HttpClient) {}

  /**
   * Fetches data from top-topic servlet according to the restrictions.
   */
  public fetchTopTopics(
      term: string|string[], startDate: string, endDate: string,
      country: string, interval: number = 1) {
    return this.callServlet(
        '/top-topics', term, startDate, endDate, country, interval, '0')
  }

  /**
   * Fetches data from rising-topic servlet according to the restrictions.
   */
  public fetchRisingTopics(
      term: string|string[], startDate: string, endDate: string,
      country: string, interval: number = 1) {
    return this.callServlet(
        '/rising-topics', term, startDate, endDate, country, interval, '0')
  }

  /**
   * Fetches data from clusterly-data servlet according to the restrictions.
   */
  public fetchClustrlyData(
      term: string|string[], startDate: string, endDate: string,
      country: string, interval: number = 1, category: string) {
    return this.callServlet(
        '/clusterly-data', term, startDate, endDate, country, interval,
        category)
  }

  /**
   * Calls the required servlet with the given parameters and returns the
   * response.
   */
  private callServlet(
      servletName: string, term: string|string[], startDate: string,
      endDate: string, country: string, interval: number, category: string) {
    const basrUrl: string = servletName + '?';
    const url = basrUrl +
        this.buildURLParameters(
            term, startDate, endDate, country, interval, category)
    return this.http.get(url, {observe: 'body', responseType: 'json'});
  }

  /**
   * Returns the parameters url part.
   */
  private buildURLParameters(
      termOrTerms: string|string[], startDate: string, endDate: string,
      country: string, interval: number, category: string): string {
    const termParameter: string = this.makeTermParameter(termOrTerms);
    const dateParameter: string = 'startDate=' + startDate + '&' +
        'endDate=' + endDate + '&';
    const countryParameter: string = 'country=' + country + '&';
    const intervalParameter: string = 'interval=' + interval + '&';
    const categoryParameter: string = 'category=' + category + '&';

    return termParameter + dateParameter + countryParameter +
        intervalParameter + categoryParameter;
  }

  /**
   * Returns the term parameter part of the url.
   * @param termOrTerms
   */
  private makeTermParameter(termOrTerms: string|string[]): string {
    const wrapTerm: (term: string) => string = (term) => 'term=' + term + '&';
    return typeof termOrTerms === 'string' ?
        wrapTerm(termOrTerms as string) :
        [...termOrTerms].reduce((terms, term) => terms += wrapTerm(term), '');
  }
}
