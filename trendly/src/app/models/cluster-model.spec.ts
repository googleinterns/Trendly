import { Cluster } from './cluster-model';
import { Bubble } from './bubble-model';

const CLUSTER = new Cluster("", 1,
    [{ title: "", volume: 15 },
    { title: "", volume: 14 },
    { title: "", volume: 13 }]);

describe('Cluster', () => {
    /** Checks the bubbles set property contains the same amount of
     * queries as the given query data */
    it('check bubbles property size', () => {
        const cluster = CLUSTER;
        expect(cluster.bubbles.size).toBe(3);
    });

    /** Checks the bubbles were created with the correct cluster id */
    it('check bubbles cluster id', () => {
        const cluster = CLUSTER;
        cluster.bubbles.forEach((bubble) => {
            expect(bubble.clusterId).toBe(1);
        })
    });

    /** Checks moveBubbleToAnotherCluster correctly remove the given bubble
     * from the current cluster its called on */
    it('check moveBubbleToAnotherCluster removes bubble from current cluster', () => {

        const [currCluster, newCluster, bubble] = get2ClustersAndBubble();
        currCluster.moveBubbleToAnotherCluster(bubble, newCluster);
        expect(currCluster.bubbles.has(bubble)).toBeFalse();
    });

    /** Checks moveBubbleToAnotherCluster correctly adds the given bubble
     * to the other cluster its given */
    it('check moveBubbleToAnotherCluster adds bubble to the given cluster', () => {
        const [currCluster, newCluster, bubble] = get2ClustersAndBubble();
        expect(newCluster.bubbles.has(bubble)).toBeFalse();
        currCluster.moveBubbleToAnotherCluster(bubble, newCluster);
        expect(newCluster.bubbles.has(bubble)).toBeTrue();
    });
});
/** Helper function for moveBubbleToAnotherCluster tests.
 *  Returns 2 created clusters and a bubble that belongs to the first one.
 */
function get2ClustersAndBubble() {
    const currCluster = new Cluster("", 1, [{ title: "", volume: 15 }]);
    const newCluster = new Cluster("", 2, [{ title: "", volume: 100 }]);
    const bubble = currCluster.bubbles.values().next().value;
    return [currCluster, newCluster, bubble];
}
