/**
 * Bubble data type - for each query of the queries received
 * from Google Trends API. Contains the query string, its volum and
 * clusterId for the cluster this query belongs.
 */

export class Bubble {
  readonly query: string;
  readonly volume: number;
  clusterId: number;

  constructor(query: string, volume: number, clusterId: number) {
    this.query = query;
    this.volume = volume;
    this.clusterId = clusterId;
  }
}
