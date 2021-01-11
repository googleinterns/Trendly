import {QueryData} from '../models/server-datatypes'
import {Bubble} from './bubble-model'

/**
 * Cluster data type - for each cluster of the clusters received
 * from the server. Contains the cluster title, its id and
 * a set of Bubbles containing the queries that belongs to this cluster.
 */

export class Cluster {
  readonly bubbles: Set<Bubble>;
  readonly additionalBubbles: Set<Bubble>;
  isDragged: number = 0;

  constructor(
      readonly title: string, readonly id: number, public volume: number,
      queriesToDisplay: QueryData[], additionalQueries: QueryData[],
      readonly relatedClustersIds: number[]) {
    this.bubbles = new Set<Bubble>(queriesToDisplay.map(
        query => new Bubble(query.title, query.value, id)));
    this.additionalBubbles = new Set<Bubble>(additionalQueries.map(
        query => new Bubble(query.title, query.value, id)));
  }

  /**
   * Removes the given bubble from this.bubbles and adds it
   * to anotherCluster.bubbles.
   */
  moveBubble(
      bubble: Bubble, anotherCluster: Cluster,
      displayed: boolean = true): void {
    bubble.clusterId = anotherCluster.id;
    this.volume -= bubble.volume;
    anotherCluster.volume += bubble.volume;
    displayed ? this.bubbles.delete(bubble) :
                this.additionalBubbles.delete(bubble);
    displayed ? anotherCluster.bubbles.add(bubble) :
                anotherCluster.additionalBubbles.add(bubble);
  }

  /**
   * Move each bubble from this.bubbles to anotherCluster.bubbles, and each
   * bubble from this.additionalBubbles to anotherCluster.additionalBubbles.
   */
  moveAllBubbles(anotherCluster: Cluster): void {
    this.bubbles.forEach((bubble) => this.moveBubble(bubble, anotherCluster));
    this.additionalBubbles.forEach(
        (bubble) => this.moveBubble(bubble, anotherCluster, false))
  }
}
