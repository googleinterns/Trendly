import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import * as d3 from 'd3';

import {AddClusterDialogComponent, AddClusterDialogData} from '../add-cluster-dialog/add-cluster-dialog.component';
import {Bubble} from '../models/bubble-model';
import {CircleDatum} from '../models/circle-datum';
import {Cluster} from '../models/cluster-model';

import {CLUSTERS_CONTAINER, ClustersSectionComponent, Location, Scales, TOOLTIP_CLASS} from './clusters-section.component';


// Mock data recieved from server.
const CLUSTER_DATA = {
  '1': {
    title: '',
    id: 1,
    volume: 10,
    queriesToDisplay: [{title: '', value: 10}],
    additionalQueries: [],
    relatedClustersIds: []
  },
  '2': {
    title: '',
    id: 2,
    volume: 15,
    queriesToDisplay: [{title: '', value: 15}],
    additionalQueries: [],
    relatedClustersIds: []
  }
};
const CLUSTER_DATA2 = {
  '1': {
    title: '',
    id: 1,
    volume: 1,
    queriesToDisplay: [{title: '', value: 1}],
    additionalQueries: [],
    relatedClustersIds: []
  },
  '2': {
    title: '',
    id: 2,
    volume: 10,
    queriesToDisplay: [{title: '', value: 10}],
    additionalQueries: [],
    relatedClustersIds: []
  }
};
// Options for clusters property.
const CLUSTERS_1_GROUP: Map<number, Cluster> =
    new Map([[1, new Cluster('', 1, 100, [{title: '', value: 1}], [], [])]]);
const CLUSTERS_2_GROUPS: Map<number, Cluster> = new Map([
  [1, new Cluster('', 1, 100, [{title: '', value: 10}], [], [])],
  [2, new Cluster('', 2, 100, [{title: '', value: 15}], [], [])]
]);
const CLUSTERS_3_GROUPS: Map<number, Cluster> = new Map([
  [1, new Cluster('', 1, 100, [{title: '', value: 1}], [], [])],
  [2, new Cluster('', 2, 100, [{title: '', value: 1}], [], [])],
  [3, new Cluster('', 3, 100, [{title: '', value: 1}], [], [])]
]);
const CLUSTERS_4_GROUPS: Map<number, Cluster> = new Map([
  [1, new Cluster('', 1, 100, [{title: '', value: 1}], [], [])],
  [2, new Cluster('', 2, 100, [{title: '', value: 1}], [], [])],
  [3, new Cluster('', 3, 100, [{title: '', value: 1}], [], [])],
  [4, new Cluster('', 4, 100, [{title: '', value: 1}], [], [])],
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

// Mock data to addClusterDialog
const DATA: AddClusterDialogData = {
  addCluster: null,
  clustersTitles: [],
  clusterly: null
};
const CONFIG = {
  data: DATA
};

describe('ClustersSectionComponent', () => {
  let component: ClustersSectionComponent;
  let fixture: ComponentFixture<ClustersSectionComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [ClustersSectionComponent],
          imports: [
            BrowserAnimationsModule,
            MatTooltipModule,
            MatDialogModule,
          ],
          providers: [
            {provide: MatDialog, useValue: DATA},
          ]
        })
        .compileComponents();
  });

  beforeEach(() => {
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(ClustersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    (component as any).clusters = new Map<number, Cluster>();
    (component as any).queries = new Array<Bubble>();
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
   * Checks processClustersObjects adds correctly the queries at clustersData to
   * this.queries.
   */
  it('should create correct queries', () => {
    (component as any).processClustersObjects(CLUSTER_DATA);
    (component as any).clustersToDisplay = (component as any).clusters;
    (component as any).processQueries();
    expect((component as any).queries).toEqual(QUERIES);
  });

  /**
   * Checks gridDivision assigns location for each clusterId in this.clusters.
   */
  it('should assign location for each cluster', () => {
    (component as any).clustersToDisplay = CLUSTERS_3_GROUPS;
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
    (component as any).clustersToDisplay = CLUSTERS_3_GROUPS;
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
    (component as any).clustersToDisplay = CLUSTERS_4_GROUPS;
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
    (component as any).svgContainer =
        (component as any).addSvg(CLUSTERS_CONTAINER);
    (component as any).addGroup();
    expect((component as any).svgContainer.select('g')).toBeDefined();
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
    (component as any).svgContainer =
        (component as any).addSvg(CLUSTERS_CONTAINER);
    const circleGroup = (component as any).addGroup();
    (component as any).addCircles(circleGroup, '', 0, Scales.ColorScale);
    expect(circleGroup.selectAll('circle').size()).toBe(2);
  });

  /**
   * Checks closestGroupId returns the correct clusterId when there is only one
   * cluster.
   */
  it('should return correct closest group when there is only 1 option', () => {
    (component as any).clusters = CLUSTERS_1_GROUP;
    (component as any).clusterIdToLoc = CLUSTER_ID_TO_LOC_1_GROUP;
    expect((component as any).closestGroupId(0, 200)).toBe(1);
  });

  /**
   * Checks closestGroupId returns the correct clusterId when there are 3
   * possible clusters.
   */
  it('should return correct closest group', () => {
    (component as any).clusters = CLUSTERS_3_GROUPS;
    (component as any).clusterIdToLoc = CLUSTER_ID_TO_LOC_3_GROUPS;
    expect((component as any).closestGroupId(0, 0)).toBe(3);
  });

  /**
   * Checks closestGroupId returns the correct clusterId when there are 2 valid
   * clusters (supposed to return the pme with the lower id).
   */
  it('should return correct closest group when there are two valid clusters options',
     () => {
       (component as any).clusters = CLUSTERS_2_GROUPS;
       (component as any).clusterIdToLoc = CLUSTER_ID_TO_LOC_2_GROUPS;
       expect((component as any).closestGroupId(50, 50)).toBe(1);
     });

  /**
   * Checks changeBubbleCluster updates correctly the bubbleObject clusterID
   * based on x and y positions.
   */
  it('should update bubble clusterID (when move bubble between clusters)',
     () => {
       initialClusterData(component);
       const bubble = new Bubble('', 10, 1);
       bubble['x'] = 0;
       bubble['y'] = 0;
       (component as any).changeBubbleCluster(bubble);
       expect(bubble.clusterId).toBe(2);
     });

  /**
   * Checks changeBubbleCluster removes bubble from previous cluster Bubble set.
   */
  it('should remove bubble correctly (when move bubble between clusters)',
     () => {
       initialClusterData(component);
       const bubble = new Bubble('', 10, 1);
       bubble['x'] = 0;
       bubble['y'] = 0;
       (component as any).changeBubbleCluster(bubble);
       expect((component as any).clusters.get(1).bubbles.has(bubble))
           .toBeFalse();
     });

  /**
   * Checks changeBubbleCluster adds bubble to the new cluster Bubble set.
   */
  it('should add bubble correctly (when move bubble between clusters)', () => {
    initialClusterData(component);
    const bubble = new Bubble('', 10, 1);
    bubble['x'] = 0;
    bubble['y'] = 0;
    (component as any).changeBubbleCluster((bubble as CircleDatum));
    expect((component as any).clusters.get(2).bubbles.has(bubble)).toBeTrue();
  });

  it('should trigger onResize method when window is resized', () => {
    const spyOnResize = spyOn(component, 'onResize');
    window.dispatchEvent(new Event('resize'));
    expect(spyOnResize).toHaveBeenCalled();
  });

  it('should emit when clusters\' list is changed', () => {
    spyOn(component.clustersEmitter, 'emit');
    (component as any).clusters = CLUSTERS_2_GROUPS;
    spyOn(component, 'ngDoCheck').and.callThrough();
    component.ngDoCheck();
    expect(component.clustersEmitter.emit).toHaveBeenCalled();
    expect(component.clustersEmitter.emit)
        .toHaveBeenCalledWith(CLUSTERS_2_GROUPS);
  });

  it('should emit when clustersToDisplay\'s list is changed', () => {
    spyOn(component.displayedClustersEmitter, 'emit');
    (component as any).clustersToDisplay = CLUSTERS_2_GROUPS;
    spyOn(component, 'ngDoCheck').and.callThrough();
    component.ngDoCheck();
    expect(component.displayedClustersEmitter.emit).toHaveBeenCalled();
    expect(component.displayedClustersEmitter.emit)
        .toHaveBeenCalledWith(CLUSTERS_2_GROUPS);
  });

  it('should emit when one of the inner clusters is changed', () => {
    initialClusterData(component);
    spyOn(component.displayedClustersEmitter, 'emit');
    (component as any)
        .clustersToDisplay.get(1)
        .bubbles.add(new Bubble('new', 3, 1));
    spyOn(component, 'ngDoCheck').and.callThrough();
    component.ngDoCheck();
    expect(component.displayedClustersEmitter.emit).toHaveBeenCalled();
  });
});

/** Helper function for changeBubbleCluster & addCircles tests. */
function initialClusterData(component) {
  const clustersData = CLUSTER_DATA2;
  (component as any).svgContainer =
      (component as any).addSvg(CLUSTERS_CONTAINER);
  (component as any).processClustersObjects(clustersData);
  (component as any).clustersToDisplay = CLUSTERS_2_GROUPS;
  (component as any).queries = QUERIES;
  (component as any).addClustersVisualization();
  (component as any).clusterIdToLoc = CLUSTER_ID_TO_LOC_2_GROUPS;
}
