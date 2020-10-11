import {Component, Input, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as d3 from 'd3';

import {ColorsService} from '../colors.service';
import {Bubble} from '../models/bubble-model';
import {CircleDatum} from '../models/circle-datum';
import {Cluster} from '../models/cluster-model';
import {ClusterDataObj, QueryData} from '../models/server-datatypes';
import {QueriesDialogComponent} from '../queries-dialog/queries-dialog.component';

import {CLUSTERS_DATA} from './mock-data'

export const CLUSTERS_CONTAINER: string = '.clusters-container';
export const TOOLTIP_CLASS: string = 'bubble-tooltip';
const LIGHT_CIRCLE_CLASS = 'light';

export interface Location {
  xPosition: number;
  yPosition: number;
}

export enum Scales {
  RadiusScale,
  ColorScale,
  LightColorScale,
  XPositionSacle
}

/**
 * Clusterls-section component - responsible for the visualization of clustered
 * queries as colored groups of bubbles with the option to interact with the
 * user.
 */
@Component({
  selector: 'app-clusters-section',
  templateUrl: './clusters-section.component.html',
  styleUrls: ['./clusters-section.component.css'],
})

export class ClustersSectionComponent {
  private clusters: Map<number, Cluster> = new Map<number, Cluster>();
  private queries: Array<Bubble> = new Array<Bubble>();
  readonly scales: Map<Scales, any> = new Map<Scales, any>();
  private circles:
      d3.Selection<SVGCircleElement, CircleDatum, SVGSVGElement, any>;
  private lightCircles:
      d3.Selection<SVGCircleElement, CircleDatum, SVGSVGElement, any>;
  private simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;
  private tooltip: d3.Selection<HTMLDivElement, any, any, any>;
  private svgContainer: d3.Selection<SVGSVGElement, any, any, any>;
  private clusterIdToLoc: Map<number, Location>;
  private maxQueryVolume: number = 0;
  private minQueryVolume: number = Infinity;
  @Input() trendsData: ClusterDataObj;

  constructor(
      private colorsService: ColorsService, public queriesDialog: MatDialog) {}

  /**
   * On each change of the data received from the server, updates the
   * visualization.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trendsData']) {
      const isUndefined = (obj) => typeof obj === 'undefined';
      this.trendsData = changes['trendsData'].currentValue;
      console.log(CLUSTERS_DATA);
      const clustersData: ClusterDataObj =
          isUndefined(this.trendsData) ? CLUSTERS_DATA : this.trendsData;
      if (isUndefined(this.svgContainer)) {
        this.svgContainer = this.addSvg(CLUSTERS_CONTAINER);
      } else {
        this.initializeProperties();
      }
      this.processClustersObjects(clustersData);
      console.log(this.clusters);
      // If exist clusters to show, adds cluster visualization
      if (this.clusters.size > 0) {
        this.addClustersVisualization();
      }
    }
  }

  /** Initializes svg content and queries + clusters data structure. */
  private initializeProperties() {
    this.tooltip.remove();
    this.svgContainer.selectAll('*').remove();
    this.clusters = new Map<number, Cluster>();
    this.queries = new Array<Bubble>();
  }

  /** Generates bubble clusters visualization based on the recieved data. */
  private addClustersVisualization(): void {
    this.addScales();

    // Map each cluster to its location on the screen.
    this.clusterIdToLoc = this.gridDivision();

    // Initialize the circle group.
    const circleGroup: d3.Selection<SVGGElement, any, any, any> =
        this.addGroup();

    // Initialize outer and inner circle for each query circle.
    this.lightCircles = this.addCircles(
        circleGroup, LIGHT_CIRCLE_CLASS, 25, Scales.LightColorScale);
    this.circles = this.addCircles(circleGroup, '', 0, Scales.ColorScale);

    this.addClusterTitles(circleGroup);

    // Add tooltip with query string for each circle.
    this.tooltip = this.addTooltip(CLUSTERS_CONTAINER);
    this.tooltipHandling();

    // Apply force clustering simulation + dragging functionallity.
    this.simulation = this.addForceSimulation();
    this.applySimulation();
    this.applyDragging();
    this.applyQueriesDialog();
  }

  /** Adds scales to this.scales to be used in this component functions. */
  private addScales(): void {
    // A scale that gives a radius size for each query based on its volume.
    this.scales.set(Scales.RadiusScale, d3.scaleSqrt().domain([1, 100]).range([
      (window.innerWidth + window.innerHeight) / 120,
      (window.innerWidth + window.innerHeight) / 50
    ]));

    // A scale that gives a color for each bubble.
    this.scales.set(
        Scales.ColorScale,
        d3.scaleOrdinal()
            .domain(Array.from(this.clusters.keys()).map(String))
            .range(this.colorsService.colors));

    // A scale that gives a light color for each outer bubble.
    this.scales.set(
        Scales.LightColorScale,
        d3.scaleOrdinal()
            .domain(Array.from(this.clusters.keys()).map(String))
            .range(this.colorsService.lightColors));

    // A scale of the x position for each group.
    this.scales.set(
        Scales.XPositionSacle,
        d3.scaleLinear().domain([1, this.clusters.size]).range([
          window.innerWidth / 6, 5 * window.innerWidth / 6
        ]));
  }

  /**
   * Process the data recieved from the server and fills this.clusters,
   * this.queries.
   */
  private processClustersObjects(clustersData: ClusterDataObj): void {
    Object.values(clustersData).forEach((cluster) => {
      const newCluster: Cluster =
          new Cluster(cluster.title, cluster.id, cluster.queries);
      newCluster.bubbles.forEach((bubble) => {
        this.minQueryVolume = Math.min(this.minQueryVolume, bubble.volume);
        this.maxQueryVolume = Math.max(this.maxQueryVolume, bubble.volume);
        this.queries.push(bubble);
      });
      this.clusters.set(newCluster.id, newCluster);
    });
  }

  /**
   * Returns a map of cluster id to Location object containing the x and y
   * position for the center of each cluster.
   */
  private gridDivision(): Map<number, Location> {
    const height: number = window.innerHeight;
    const upperYPosition: number = Math.min(300, height / 3);
    const lowerYPosition: number = 3 * height / 4;
    const clusterIdToLoc: Map<number, Location> = new Map<number, Location>();
    this.clusters.forEach((cluster) => {
      const x: number = this.scales.get(Scales.XPositionSacle)(cluster.id);
      const y: number = cluster.id % 2 === 0 ? upperYPosition : lowerYPosition;
      clusterIdToLoc.set(cluster.id, {xPosition: x, yPosition: y});
    });
    return clusterIdToLoc;
  }

  /**
   * Adds a svg object to the container and returns the created svg.
   */
  private addSvg(container: string):
      d3.Selection<SVGSVGElement, any, any, any> {
    return d3.select(container)
        .append('svg')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight);
  }

  /**
   * Adds a group (g object) to the svgContainer and returns the created group.
   */
  private addGroup(): d3.Selection<SVGGElement, any, any, any> {
    return this.svgContainer.append('g');
  }

  /**
   * Adds a tooltip div to the container and returns the created div.
   */
  private addTooltip(container: string):
      d3.Selection<HTMLDivElement, any, any, any> {
    return d3.select(container).append('div').attr('class', TOOLTIP_CLASS);
  }

  /**
   * Adds circles bind to this.queries to circleGroup and returns the created
   * circles.
   */
  private addCircles(
      circleGroup, id: string, radiusAddition: number, colorScale: Scales):
      d3.Selection<SVGCircleElement, CircleDatum, SVGSVGElement, any> {
    return circleGroup.selectAll('g')
        .data(this.queries)
        .enter()
        .append('circle')
        .attr('class', (d, i) => 'circle' + i + id)
        .attr(
            'r',
            (d) =>
                this.scales.get(Scales.RadiusScale)(d.volume) + radiusAddition)
        .attr('cx', (d) => this.clusterIdToLoc.get(d.clusterId).xPosition)
        .attr('cy', (d) => this.clusterIdToLoc.get(d.clusterId).yPosition)
        .style('fill', (d) => this.scales.get(colorScale)(d.clusterId))
  }

  /**
   * Returns the cluster id of the nearest clusr to the given x,y coordinates.
   */
  private closestGroupId(x: number, y: number): number {
    const getDistance = (pos) => Math.sqrt(
        Math.pow(pos.xPosition - x, 2) + Math.pow(pos.yPosition - y, 2));
    const [closestId, distance] =
        Array.from(this.clusterIdToLoc.entries())
            .map(([id, pos]) => [id, getDistance(pos)])
            .reduce(
                ([closestId, closestDist], [currId, currDist]) =>
                    currDist < closestDist ? [currId, currDist] :
                                             [closestId, closestDist],
                [-1, Infinity]);
    return closestId;
  }

  /** Adds the clusters' titles as text above each group of bubbles */
  private addClusterTitles(circleGroup) {
    this.clusterIdToLoc.forEach((location, clusterID) => {
      if (clusterID != -1) {
        circleGroup.append('text')
            .attr('class', 'clusters-titles')
            .text(this.clusters.get(clusterID).title)
            .attr('x', location.xPosition - window.innerWidth / 80)
            .attr(
                'y',
                location.yPosition - Math.min(window.innerHeight / 4, 200));
      }
    });
  }

  /**
   * Adds to circle tooltip functionality (tooltip appears when the mouse is
   * over the circle and disapears when it moves).
   */
  private tooltipHandling(): void {
    const mousemove = (d) => {
      this.tooltip.html(d.query)
          .style('left', (d3.event.pageX + 25) + 'px')
          .style('top', (d3.event.pageY - 45) + 'px');
    };
    this.circles
        .on('mouseover',
            () => {
              this.tooltip.style('display', 'inline');
            })
        .on('mousemove', mousemove)
        .on('mouseleave', () => {
          this.tooltip.style('display', 'none');
        })
  }

  /**
   * Returns force simulation (x and y positions, centrering  and anti-collide).
   */
  private addForceSimulation():
      d3.Simulation<d3.SimulationNodeDatum, undefined> {
    return d3.forceSimulation()
        .force(
            'x',
            d3.forceX().strength(0.5).x(
                (d: CircleDatum) =>
                    this.clusterIdToLoc.get(d.clusterId).xPosition))
        .force(
            'y',
            d3.forceY().strength(0.5).y(
                (d: CircleDatum) =>
                    this.clusterIdToLoc.get(d.clusterId).yPosition))
        .force(
            'center',
            d3.forceCenter()
                .x(window.innerWidth / 2)
                .y(window.innerHeight /
                   2))  // Attraction to the center of the svg.
        .force(
            'charge',
            d3.forceManyBody().strength(
                1))  // Nodes are attracted one each other.
        .force(
            'collide',
            d3.forceCollide()
                .strength(1)
                .radius(
                    (d: CircleDatum) =>
                        this.scales.get(Scales.RadiusScale)(d.volume) + 1)
                .iterations(1))  // Avoids circle overlapping.
  }

  /** Applies given simulation on inner and outer circles. */
  private applySimulation(): void {
    this.simulation.nodes(this.queries).on('tick', () => {
      this.circles.attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)
          .style(
              'fill', (d) => this.scales.get(Scales.ColorScale)(d.clusterId));
      this.lightCircles.attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)
          .style(
              'fill',
              (d) => this.scales.get(Scales.LightColorScale)(d.clusterId))
    });
  }

  /** Adds dragging functionality to inner and outer circles. */
  private applyDragging(): void {
    this.circles.call(d3.drag()
                          .on('start', this.onDragCircleStarted.bind(this))
                          .on('drag', this.onDraggedCircle.bind(this))
                          .on('end', this.onDragCircleEnded.bind(this)));
    this.lightCircles.call(d3.drag()
                               .on('start', this.onDragCircleStarted.bind(this))
                               .on('drag', this.onDraggedCircle.bind(this))
                               .on('end', this.onDragCircleEnded.bind(this)));
  }

  /** Handles circle's simulation properties in the beginning of drag event.*/
  private onDragCircleStarted(d: CircleDatum): void {
    if (!d3.event.active) {
      this.simulation.alphaTarget(.03).restart();
    }
    this.tooltip.style('display', 'none');
    d.fx = d.x;
    d.fy = d.y;
  }

  /** Handles circle's simulation properties during drag event.*/
  private onDraggedCircle(d: CircleDatum): void {
    this.tooltip.style('display', 'none');
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  /** Handles circle's simulation properties at the end of drag event.*/
  private onDragCircleEnded(d: CircleDatum): void {
    if (!d3.event.active) {
      this.simulation.alphaTarget(.03);
    }
    this.tooltip.style('display', 'none');
    this.changeBubbleCluster(d);
    this.applySimulation();
    d.fx = null;
    d.fy = null;
  }

  /** Changes bubble cluster based on current position. */
  private changeBubbleCluster(bubbleObj: CircleDatum): void {
    const currentCluster: Cluster = this.clusters.get(bubbleObj.clusterId);
    // Get new ClusterId based on current position.
    bubbleObj.clusterId = this.closestGroupId(bubbleObj.x, bubbleObj.y);
    const newCluster: Cluster = this.clusters.get(bubbleObj.clusterId);
    currentCluster.moveBubble(bubbleObj, newCluster);
  }

  /**
   * Called from the dialog, updates the clusters based on the event chosen
   * new cluster and queries to move.
   */
  updateClustersBasedOnDialog(
      newCluster: Cluster, selections: any[], currCluster: Cluster,
      clusterly: ClustersSectionComponent): void {
    selections.forEach((option) => {
      const bubble: Bubble = option._value;
      currCluster.moveBubble(bubble, newCluster);
    });
    clusterly.applySimulation();
    clusterly.queriesDialog.closeAll();
  }

  /**
   * Binds bubbles click event to opening queries dialog.
   */
  private applyQueriesDialog(): void {
    this.circles.on('click', this.openQueriesDialog.bind(this));
    this.lightCircles.on('click', this.openQueriesDialog.bind(this));
  }

  /**
   * Adds a dialog with the queries belongs to a specific cluster
   * when the user click on a bubble.
   */
  private openQueriesDialog(d: CircleDatum) {
    const cluster: Cluster = this.clusters.get(d.clusterId);
    const sortedQueries: Bubble[] =
        Array.from(cluster.bubbles)
            .sort((bubble1, bubble2) => bubble2.volume - bubble1.volume);

    this.queriesDialog.open(QueriesDialogComponent, {
      data: {
        clusterly: this,
        currentCluster: cluster,
        queries: sortedQueries,
        clusters: Array.from(this.clusters.values()),
        updateFunc: this.updateClustersBasedOnDialog,
      }
    });
  }
}
