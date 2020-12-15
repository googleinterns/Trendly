import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
interface Topic {
  title: string;
  value: number;
  mid: string;
  description: string;
}

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
  public fetchHistograsmyData (
    term: string|string[], startDate: string, endDate: string,
    country: string, interval: number = 1, category: string, funcName : string, topics? : Topic[]) {
  return this.callServlet(
      '/histogramy-data', term, startDate, endDate, country, interval, category, funcName, topics);
  }
  // /**
  //  * Fetches data from top-topic servlet according to the restrictions.
  //  */
  // public fetchTopTopics(
  //     term: string|string[], startDate: string, endDate: string,
  //     country: string, interval: number = 1, category: string, topics? : Topic[]) {
  //   return this.callServlet(
  //       '/top-topics', term, startDate, endDate, country, interval, category, topics)
  // }

  // /**
  //  * Fetches data from rising-topic servlet according to the restrictions.
  //  */
  // public fetchRisingTopics(
  //     term: string|string[], startDate: string, endDate: string,
  //     country: string, interval: number = 1, category: string, topics? : Topic[]) {
  //   return this.callServlet(
  //       '/rising-topics', term, startDate, endDate, country, interval, category, topics)
  // }

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
      endDate: string, country: string, interval: number, category: string, funcName? : string, topics? : Topic[]) {
        console.log(topics)
    const basrUrl: string = servletName + '?';
    let url = basrUrl +
        this.buildURLParameters(
            term, startDate, endDate, country, interval, category);
    funcName ? url += 'funcName=' + funcName + '&' : null;
    (topics != null) ? url += this.buildTopicsParameter(topics) : null;
    console.log(url);
    return this.http.get(url, {observe: 'body', responseType: 'json'});
  }

  private buildTopicsParameter(topics : Topic[])
  {
    const topicsURL : string = 'topics=' + (JSON.stringify(topics) as any).replaceAll('&', '%26');

    // for (let i = 0; i < topics.length; i++)
    // {
    //   const topic = 'topics[' + i + ']';
    //   const empty = '';
    //   topicsURL += topic + '[title]=' + topics[i].title + '&' + topic + '[mid]=' + topics[i].mid + '&' + topic + '[description]=' + empty + '&' + topic + '[value]=' + empty + '&';
    // }
    return topicsURL;
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
    const wrapTerm: (term: string) => string = (term) => 'term=' + (term as any).replaceAll('&', '%26') + '&';
    let termURL = '';
    if (typeof termOrTerms === 'string') {
      termURL = wrapTerm(termOrTerms as string);
    }
    else {
      termURL = termOrTerms.length === 0 ? 'term=&': [...termOrTerms].reduce((terms, term) => terms += wrapTerm(term), '');
      }
    return termURL;
  }
}
