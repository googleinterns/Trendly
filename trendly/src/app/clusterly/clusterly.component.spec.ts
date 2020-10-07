import {ComponentFixture, TestBed} from '@angular/core/testing';
import * as d3 from 'd3';

import {Bubble} from '../models/bubble-model';
import {Cluster} from '../models/cluster-model';
import {ClusterData} from '../models/server-datatypes'
import {ClusterlyComponent, CLUSTERS_CONTAINER, Location, Scales, TOOLTIP_CLASS} from './clusterly.component';

// Mock data recieved from server.
const CLUSTER_DATA: ClusterData[] = [
  {title: '', id: 1, queries: [{title: '', value: 10}]},
  {title: '', id: 2, queries: [{title: '', value: 15}]}
];
const CLUSTER_DATA2: ClusterData[] = [
  {title: '', id: 1, queries: [{title: '', value: 1}]}, {
    title: '',
    id: 2,
    queries: [{title: '', value: 1}, {title: '', value: 1}]
  }
];

// Options for clusters property.
const CLUSTERS_1_GROUP: Map<number, Cluster> =
    new Map([[1, new Cluster('', 1, [{title: '', value: 1}])]]);
const CLUSTERS_2_GROUPS: Map<number, Cluster> = new Map([
  [1, new Cluster('', 1, [{title: '', value: 10}])],
  [2, new Cluster('', 2, [{title: '', value: 15}])]
]);
const CLUSTERS_3_GROUPS: Map<number, Cluster> = new Map([
  [1, new Cluster('', 1, [{title: '', value: 1}])],
  [2, new Cluster('', 2, [{title: '', value: 1}])],
  [3, new Cluster('', 3, [{title: '', value: 1}])]
]);
const CLUSTERS_4_GROUPS: Map<number, Cluster> = new Map([
  [1, new Cluster('', 1, [{title: '', value: 1}])],
  [2, new Cluster('', 2, [{title: '', value: 1}])],
  [3, new Cluster('', 3, [{title: '', value: 1}])],
  [4, new Cluster('', 4, [{title: '', value: 1}])]
]);

// Options for queries property.
const QUERIES: Array<Bubble> = [new Bubble('', 10, 1), new Bubble('', 15, 2)];

// Options for cluster to id loc map.
const CLUSTER_ID_TO_LOC_1_GROUP: Map<number, Location> =
    new Map([[1, {xPosition: 100, yPosition: 100}]]);
const CLUSTER_ID_TO_LOC_2_GROUPS: Map<number, Location> = new Map(
    [[1, {xPosition: 100, yPosition: 100}], [2, {xPosition: 0, yPosition: 0}]]);
const CLUSTER_ID_TO_LOC_3_GROUPS: Map<number, Location> = new Map([
  [1, {xPosition: 100, yPosition: 100}], [2, {xPosition: 50, yPosition: 50}],
  [3, {xPosition: 25, yPosition: 25}]
]);

describe('ClusterlyComponent', () => {
  let component: ClusterlyComponent;
  let fixture: ComponentFixture<ClusterlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({declarations: [ClusterlyComponent]})
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  /**
   * Checks addScales adds successfully all the scales defined in Scales enum.
   */
  it('should add all needed scales', () => {
    (component as any).addScales();
    for (const scale in Scales) {
      if (!isNaN(+scale)) {
        expect(typeof (component as any).scales.get(+scale)).toBe('function');
      }
    }
  });

  /**
   * Checks processClustersObjects adds correctly the clusters at clustersData
   * to this.clusters.
   */
  it('should create correct clusters', () => {
    (component as any).clusters = new Map<number, Cluster>();
    (component as any).processClustersObjects(CLUSTER_DATA);
    expect((component as any).clusters).toEqual(CLUSTERS_2_GROUPS);
  });

  /**
   * Checks processClustersObjects adds correctly the queries at clustersData to
   * this.queries.
   */
  it('should create correct queries', () => {
    (component as any).queries = new Array<Bubble>();
    (component as any).processClustersObjects(CLUSTER_DATA);
    expect((component as any).queries).toEqual(QUERIES);
  });

  /**
   * Checks gridDivision assigns location for each clusterId in this.clusters.
   */
  it('should assign location for each cluster', () => {
    (component as any).clusters = CLUSTERS_3_GROUPS;
    (component as any).addScales();
    const clusterIdtoLoc: Map<number, Location> =
        (component as any).gridDivision();
    for (let i = 1; i <= CLUSTERS_3_GROUPS.size; i++) {
      expect(clusterIdtoLoc.get(i)).toBeDefined();
    }
  });

  /**
   * Checks gridDivision assigns valid location for each clusterId in
   * this.clusters (e.g. xPositsion is betwwen 0 and WIDTH and yPosition is
   * between 0 and HEIGHT).
   */
  it('should assign valid locations ', () => {
    (component as any).clusters = CLUSTERS_3_GROUPS;
    (component as any).addScales();
    const clusterIdtoLoc: Map<number, Location> =
        (component as any).gridDivision();
    for (let i = 1; i <= CLUSTERS_3_GROUPS.size; i++) {
      expect(
          clusterIdtoLoc.get(i).xPosition >= 0 &&
          clusterIdtoLoc.get(i).xPosition <= window.innerWidth)
          .toBeTrue();
      expect(
          clusterIdtoLoc.get(i).yPosition >= 0 &&
          clusterIdtoLoc.get(i).yPosition <= window.innerHeight)
          .toBeTrue();
    }
  });

  /**
   * Checks gridDivision makes an equal division of the space (e.g. the distance
   * between each close pair of clusters is the same).
   */
  it('should assign equally distributed locations ', () => {
    (component as any).clusters = CLUSTERS_4_GROUPS;
    (component as any).addScales();
    let distance: number;
    const clusterIdtoLoc: Map<number, Location> =
        (component as any).gridDivision();
    distance = Math.sqrt(
        Math.pow(
            clusterIdtoLoc.get(1).xPosition - clusterIdtoLoc.get(2).xPosition,
            2) +
        Math.pow(
            clusterIdtoLoc.get(1).yPosition - clusterIdtoLoc.get(2).yPosition,
            2));
    for (let i = 2; i <= CLUSTERS_4_GROUPS.size - 1; i++) {
      const currDistance = Math.sqrt(
          Math.pow(
              clusterIdtoLoc.get(i).xPosition -
                  clusterIdtoLoc.get(i + 1).xPosition,
              2) +
          Math.pow(
              clusterIdtoLoc.get(i).yPosition -
                  clusterIdtoLoc.get(i + 1).yPosition,
              2));
      expect(currDistance.toFixed(3)).toBe(distance.toFixed(3));
      distance = currDistance;
    }
  });

  /** Checks addSvg actually add svg to the page. */
  it('should add svg', () => {
    (component as any).addSvg(CLUSTERS_CONTAINER);
    expect(d3.select('svg')).toBeDefined();
  });

  /* Checks the created svg at the page has the correct width. */
  it('should create svg with the correct width', () => {
    (component as any).addSvg(CLUSTERS_CONTAINER);
    expect(d3.select('svg').attr('width')).toBe(window.innerWidth.toString());
  });

  /* Checks the created svg at the page has the correct height. */
  it('should create svg with the correct height', () => {
    (component as any).addSvg(CLUSTERS_CONTAINER);
    expect(d3.select(CLUSTERS_CONTAINER).select('svg').attr('height'))
        .toBe(window.innerHeight.toString());
  });

  /** Checks addGroup actually add g object to the svgContainer. */
  it('should add a group', () => {
    const svg = (component as any).addSvg(CLUSTERS_CONTAINER);
    (component as any).addGroup(svg);
    expect(svg.select('g')).toBeDefined();
  });

  /**
   * Checks the added tooltip div has the correct class (since it's being used
   * in the css).
   */
  it('should add tooltip div with the correct class', () => {
    (component as any).addTooltip(CLUSTERS_CONTAINER);
    expect(d3.select(CLUSTERS_CONTAINER).select('div').attr('class'))
        .toBe(TOOLTIP_CLASS);
  });

  /**
   * Checks the amount of circles added by addCircles match the amount of
   * queries at this.queries.
   */
  it('should create circle for each query', () => {
    initialClusterData(component);
    const svg = (component as any).addSvg(CLUSTERS_CONTAINER);
    const circleGroup = (component as any).addGroup(svg);
    const clusterIdtoLoc: Map<number, Location> = CLUSTER_ID_TO_LOC_3_GROUPS;
    (component as any)
        .addCircles(circleGroup, '', 0, clusterIdtoLoc, Scales.ColorScale);
    expect(circleGroup.selectAll('circle').size()).toBe(3);
  });

  /**
   * Checks closestGroupId returns the correct clusterId when there is only one
   * cluster.
   */
  it('should return correct closest group when there is only 1 option', () => {
    (component as any).clusters = CLUSTERS_1_GROUP;
    const clusterIdtoLoc: Map<number, Location> = CLUSTER_ID_TO_LOC_1_GROUP;
    expect((component as any).closestGroupId(0, 200, clusterIdtoLoc)).toBe(1);
  });

  /**
   * Checks closestGroupId returns the correct clusterId when there are 3
   * possible clusters.
   */
  it('should return correct closest group', () => {
    (component as any).clusters = CLUSTERS_3_GROUPS;
    const clusterIdtoLoc: Map<number, Location> = CLUSTER_ID_TO_LOC_3_GROUPS;
    expect((component as any).closestGroupId(0, 0, clusterIdtoLoc)).toBe(3);
  });

  /**
   * Checks closestGroupId returns the correct clusterId when there are 2 valid
   * clusters (supposed to return the pme with the lower id).
   */
  it('should return correct closest group when there are two valid clusters options',
     () => {
       (component as any).clusters = CLUSTERS_2_GROUPS;
       const clusterIdtoLoc: Map<number, Location> = CLUSTER_ID_TO_LOC_2_GROUPS;
       expect((component as any).closestGroupId(50, 50, clusterIdtoLoc))
           .toBe(1);
     });

  /**
   * Checks changeBubbleCluster updates correctly the bubbleObject clusterID
   * based on x and y positions.
   */
  it('should update bubble clusterID (when move bubble between clusters)',
     () => {
       initialClusterData(component);
       const clusterIdtoLoc: Map<number, Location> = CLUSTER_ID_TO_LOC_2_GROUPS
       const bubble = new Bubble('', 10, 1);
       bubble['x'] = 25;
       bubble['y'] = 25;
       const svg = (component as any).addSvg(CLUSTERS_CONTAINER);
       const circleGroup = (component as any).addGroup(svg);
       (component as any)
           .addCircles(circleGroup, '', 0, clusterIdtoLoc, Scales.ColorScale);
       (component as any)
           .addCircles(
               circleGroup, 'light', 25, clusterIdtoLoc,
               Scales.LightColorScale);
       const circle = circleGroup.select('circle').node();
       (component as any).changeBubbleCluster(circle, bubble, clusterIdtoLoc);
       expect(bubble.clusterId).toBe(2);
     });

  /**
   * Checks changeBubbleCluster removes bubble from previous cluster Bubble set.
   */
  it('should remove bubble correctly (when move bubble between clusters)',
     () => {
       initialClusterData(component);
       const clusterIdtoLoc: Map<number, Location> = CLUSTER_ID_TO_LOC_2_GROUPS;
       const bubble = new Bubble('', 10, 1);
       bubble['x'] = 25;
       bubble['y'] = 25;
       const svg = (component as any).addSvg(CLUSTERS_CONTAINER);
       const circleGroup = (component as any).addGroup(svg);
       (component as any)
           .addCircles(circleGroup, '', 0, clusterIdtoLoc, Scales.ColorScale);
       (component as any)
           .addCircles(
               circleGroup, 'light', 25, clusterIdtoLoc,
               Scales.LightColorScale);
       const circle = circleGroup.select('circle').node();
       (component as any).changeBubbleCluster(circle, bubble, clusterIdtoLoc);
       expect((component as any).clusters.get(1).bubbles.has(bubble))
           .toBeFalse();
     });

  /**
   * Checks changeBubbleCluster adds bubble to the new cluster Bubble set.
   */
  it('should add bubble correctly (when move bubble between clusters)', () => {
    initialClusterData(component);
    const clusterIdtoLoc: Map<number, Location> = CLUSTER_ID_TO_LOC_2_GROUPS;
    const bubble = new Bubble('', 10, 1);
    bubble['x'] = 25;
    bubble['y'] = 25;
    const svg = (component as any).addSvg(CLUSTERS_CONTAINER);
    const circleGroup = (component as any).addGroup(svg);
    (component as any)
        .addCircles(circleGroup, '', 0, clusterIdtoLoc, Scales.ColorScale);
    (component as any)
        .addCircles(
            circleGroup, 'light', 25, clusterIdtoLoc, Scales.LightColorScale);
    const circle = circleGroup.select('circle').node();
    (component as any).changeBubbleCluster(circle, bubble, clusterIdtoLoc);
    expect((component as any).clusters.get(2).bubbles.has(bubble)).toBeTrue();
  });

  /**
   * Checks updateCircleColor change the given circle color correctly based on
   * new clusterId and colorScale.
   */
  it('should update color correctly (when move bubble between clusters)',
     () => {
       initialClusterData(component);
       const svg = (component as any).addSvg(CLUSTERS_CONTAINER);
       const circleGroup = (component as any).addGroup(svg);
       const circle = circleGroup.append('circle');
       (component as any).updateCircleColor(circle, 1, Scales.ColorScale);
       expect(circle.style('fill'))
           .toEqual(d3.rgb((component as any).scales.get(Scales.ColorScale)(1))
                        .toString());
     });
});

/* Helper function for changeBubbleCluster & addCircles tests. */
function initialClusterData(component) {
  const clustersData: ClusterData[] = CLUSTER_DATA2;
  (component as any).clusters = new Map<number, Cluster>();
  (component as any).queries = new Array<Bubble>();
  (component as any).processClustersObjects(clustersData);
  (component as any).addScales();
}
