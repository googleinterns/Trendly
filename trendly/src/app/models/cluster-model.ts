import {QueryData} from '../models/server-datatypes'
import {Bubble} from './bubble-model'

/**
 * Cluster data type - for each cluster of the clusters received
 * from the server. Contains the cluster title, its id and
 * a set of Bubbles containing the queries that belongs to this cluster.
 */

export class Cluster {
  readonly bubbles: Set<Bubble>;

  constructor(
      readonly title: string, readonly id: number, queries: QueryData[]) {
    this.bubbles = new Set<Bubble>(
        queries.map(query => new Bubble(query.title, query.value, id)));
  }

  /**
   * Removes the given bubble from this.bubbles and adds it
   * to anotherCluster.bubbles.
   */
  moveBubble(bubble: Bubble, anotherCluster: Cluster): void {
    this.bubbles.delete(bubble);
    anotherCluster.bubbles.add(bubble);
  }
}
