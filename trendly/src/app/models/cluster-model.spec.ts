import { Cluster } from './cluster-model';

describe('Cluster', () => {
    /** Checks the bubbles set property contains the same amount of
     * queries as the given query data */
    it('check bubbles property size', () => {
        const cluster = new Cluster("curr", 1,
            [{ queryString: "", volume: 15 },
            { queryString: "", volume: 14 },
            { queryString: "", volume: 13 }]);
        expect(cluster.bubbles.size).toBe(3);
    });

    /** Checks the bubbles were created with the correct cluster id */
    it('check bubbles cluster id', () => {
        const cluster = new Cluster("curr", 1,
            [{ queryString: "", volume: 15 },
            { queryString: "", volume: 14 },
            { queryString: "", volume: 13 }]);
        cluster.bubbles.forEach((bubble) => {
            expect(bubble.clusterId).toBe(1);
        })
    });

    /** Checks moveBubbleToAnotherCluster correctly remove the given bubble
     * from the current cluster its called on */
    it('check moveBubbleToAnotherCluster removes bubble from current cluster', () => {
        const currCluster = new Cluster("curr", 1, [{ queryString: "", volume: 15 }]);
        const newCluster = new Cluster("curr", 2, [{ queryString: "", volume: 100 }]);
        const bubble = currCluster.bubbles[0];
        currCluster.moveBubbleToAnotherCluster(bubble, newCluster);
        expect(currCluster.bubbles.has(bubble)).toBeFalse();
    });

    /** Checks moveBubbleToAnotherCluster correctly adds the given bubble
     * to the other cluster its given */
    it('check moveBubbleToAnotherCluster adds bubble to the given cluster', () => {
        const currCluster = new Cluster("curr", 1, [{ queryString: "", volume: 15 }]);
        const newCluster = new Cluster("curr", 2, [{ queryString: "", volume: 100 }]);
        const bubble = currCluster.bubbles[0];
        expect(newCluster.bubbles.has(bubble)).toBeFalse();
        currCluster.moveBubbleToAnotherCluster(bubble, newCluster);
        expect(newCluster.bubbles.has(bubble)).toBeTrue();
    });

});
