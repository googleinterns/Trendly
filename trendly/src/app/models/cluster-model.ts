import {QueryData} from '../models/server-datatypes'
import {Bubble} from './bubble-model'

/**
 * Cluster data type - for each cluster of the clusters received
 * from the server. Contains the cluster title, its id and
 * a set of Bubbles containing the queries that belongs to this cluster.
 */

export class Cluster {
  readonly bubbles: Set<Bubble>;
  readonly additionalBubbles: Bubble[];

  constructor(
      readonly title: string, readonly id: number, public volume: number,
      queriesToDisplay: QueryData[], additionalQueries: QueryData[],
      readonly relatedClustersIds: number[]) {
    this.bubbles = new Set<Bubble>(queriesToDisplay.map(
        query => new Bubble(query.title, query.value, id)));
    this.additionalBubbles = additionalQueries.map(
        query => new Bubble(query.title, query.value, id));
  }

  /**
   * Removes the given bubble from this.bubbles and adds it
   * to anotherCluster.bubbles.
   */
  moveBubble(bubble: Bubble, anotherCluster: Cluster): void {
    bubble.clusterId = anotherCluster.id;
    this.volume -= bubble.volume;
    anotherCluster.volume += bubble.volume;
    this.bubbles.delete(bubble);
    anotherCluster.bubbles.add(bubble);
  }
}
