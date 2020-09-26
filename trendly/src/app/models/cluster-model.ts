import { Bubble } from './bubble-model'
import { QueryData } from '../models/server-datatypes'

/**
 * Cluster data type - for each cluster of the clusters received
 * from the server. Contains the cluster title, its id and
 * a set of Bubbles containing the queries that belongs to this cluster.
 */

export class Cluster {
  readonly title: string;
  readonly id: number;
  readonly bubbles: Set<Bubble> = new Set<Bubble>();

  constructor(title: string, id: number, queries: QueryData[]) {
    this.title = title;
    this.id = id;
    queries.forEach((query) =>
      this.bubbles.add(new Bubble(query.title, query.volume, id))
    );
  }

  /** Removes the given bubble from this.bubbles and adds it
   * to anotherCluster.bubbles.
   */
  moveBubbleToAnotherCluster(bubble: Bubble, anotherCluster: Cluster): void {
    bubble.clusterId = anotherCluster.id;
    this.bubbles.delete(bubble);
    anotherCluster.bubbles.add(bubble);
  }
}
