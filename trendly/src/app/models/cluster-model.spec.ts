import {Cluster} from './cluster-model';

const CLUSTER = new Cluster(
    '', 1,
    [{title: '', value: 15}, {title: '', value: 14}, {title: '', value: 13}]);

describe('Cluster', () => {
  /**
   * Checks the bubbles set property contains the same amount of
   * queries as the given query data
   */
  it('should create bubble with the correct size', () => {
    const cluster = CLUSTER;
    expect(cluster.bubbles.size).toBe(3);
  });

  /** Checks the bubbles were created with the correct cluster id */
  it('should create bubble with the correct cluster id', () => {
    const cluster = CLUSTER;
    cluster.bubbles.forEach((bubble) => {
      expect(bubble.clusterId).toBe(1);
    })
  });

  /**
   * Checks moveBubbleToAnotherCluster correctly remove the given bubble from
   * the current cluster its called on
   */
  it('should remove bubble from current cluster', () => {
    const [currCluster, newCluster, bubble] = get2ClustersAndBubble();
    currCluster.moveBubbleToAnotherCluster(bubble, newCluster);
    expect(currCluster.bubbles.has(bubble)).toBeFalse();
  });

  /**
   * Checks moveBubbleToAnotherCluster correctly adds the given bubble
   * to the other cluster its given
   */
  it('should add bubble to the given cluster', () => {
    const [currCluster, newCluster, bubble] = get2ClustersAndBubble();
    expect(newCluster.bubbles.has(bubble)).toBeFalse();
    currCluster.moveBubbleToAnotherCluster(bubble, newCluster);
    expect(newCluster.bubbles.has(bubble)).toBeTrue();
  });
});
/**
 * Helper function for moveBubbleToAnotherCluster tests.
 *  Returns 2 created clusters and a bubble that belongs to the first one.
 */
function get2ClustersAndBubble() {
  const currCluster = new Cluster('', 1, [{title: '', value: 15}]);
  const newCluster = new Cluster('', 2, [{title: '', value: 100}]);
  const bubble = currCluster.bubbles[0];
  return [currCluster, newCluster, bubble];
}
