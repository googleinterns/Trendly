/**
 * Bubble data type - for each query of the queries received
 * from Google Trends API. Contains the query string, its volum and
 * clusterId for the cluster this query belongs.
 */

export class Bubble {
  constructor(
      readonly query: string, readonly volume: number,
      public clusterId: number) {}
}
