import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as d3 from 'd3';

import {ColorsService} from '../colors.service';
import {Bubble} from '../models/bubble-model';
import {CircleDatum} from '../models/circle-datum';
import {Cluster} from '../models/cluster-model';
import {ClusterData, QueryData} from '../models/server-datatypes';
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
 * Clusterly component - responsible for the visualization of clustered queries
 * as colored groups of bubbles with the option to interact with the user.
 */
@Component({
  selector: 'app-clusterly',
  templateUrl: './clusterly.component.html',
  styleUrls: ['./clusterly.component.css'],
})

export class ClusterlyComponent implements OnInit {
  readonly clusters: Map<number, Cluster> = new Map<number, Cluster>();
  readonly queries: Array<Bubble> = new Array<Bubble>();
  readonly scales: Map<Scales, any> = new Map<Scales, any>();
  private circles:
      d3.Selection<SVGCircleElement, CircleDatum, SVGSVGElement, any>;
  private lightCircles:
      d3.Selection<SVGCircleElement, CircleDatum, SVGSVGElement, any>;
  private simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;
  private tooltip: d3.Selection<HTMLDivElement, any, any, any>;
  private clusterIdToLoc: Map<number, Location>;

  constructor(
      private colorsService: ColorsService, public queriesDialog: MatDialog) {}


  // TODO: Replace with ngOnChange when the server is connected.
  ngOnInit(): void {
    // TODO: replace with data from the server (currently, mock data).
    const clustersData: ClusterData[] = this.getData();

    this.processClustersObjects(clustersData);
    this.addScales();

    // If exist clusters to show, adds cluster visualization.
    if (this.clusters.size > 0) {
      this.addClustersVisualization();
    }
  }

  /** Generates bubble clusters visualization based on the recieved data. */
  private addClustersVisualization(): void {
    // Map each cluster to its location on the screen.
    this.clusterIdToLoc = this.gridDivision();

    // Append the svg object to the cluster container.
    const svgContainer: d3.Selection<SVGSVGElement, any, any, any> =
        this.addSvg(CLUSTERS_CONTAINER);

    // Initialize the circle group.
    const circleGroup: d3.Selection<SVGGElement, any, any, any> =
        this.addGroup(svgContainer);

    // Initialize outer and inner circle for each query circle.
    this.lightCircles = this.addCircles(
        circleGroup, LIGHT_CIRCLE_CLASS, 25, Scales.LightColorScale);
    this.circles = this.addCircles(circleGroup, '', 0, Scales.ColorScale);

    // Add tooltip with query string for each circle.
    this.tooltip = this.addTooltip(CLUSTERS_CONTAINER);
    this.tooltipHandling();

    // Apply force clustering simulation + dragging functionallity.
    this.simulation = this.addForceSimulation();
    this.applySimulation();
    this.applyDragging();
    this.applyQueriesDialog();
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * Returns random mock data (clustersAmount random clusters in the same format
   * of the data from the server).
   */
  private getRandomData(clustersAmount: number): ClusterData[] {
    const clusterData: ClusterData[] = [];
    for (let i = 1; i <= clustersAmount; i++) {
      const currQueries: QueryData[] = [];
      const queriesAmount: number = this.getRandomInt(6) + 2;
      for (let j = 1; j <= queriesAmount; j++) {
        currQueries.push({
          title: 'this is query ' + j + ' from cluster ' + i + ' originally',
          value: this.getRandomInt(100),
        })
      }
      const currCluster = {title: 'Cluster ' + i, id: i, queries: currQueries};
      clusterData.push(currCluster);
    }
    return clusterData
  }

  /**
   * Returns mock data (const clusters in the same format of the data from the
   * server).
   */
  private getData(): ClusterData[] {
    return CLUSTERS_DATA;
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
  private processClustersObjects(clustersData: ClusterData[]): void {
    clustersData.forEach((cluster) => {
      const newCluster: Cluster =
          new Cluster(cluster.title, cluster.id, cluster.queries);
      newCluster.bubbles.forEach((bubble) => this.queries.push(bubble));
      this.clusters.set(newCluster.id, newCluster);
    });
  }

  /**
   * Returns a map of cluster id to Location object containing the x and y
   * position for the center of each cluster.
   */
  private gridDivision(): Map<number, Location> {
    const height: number = 4 * window.innerHeight / 5;
    const upperYPosition: number = height / 4;
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
  private addGroup(svgContainer): d3.Selection<SVGGElement, any, any, any> {
    return svgContainer.append('g');
  }

  /**
   * Adds a tooltip div to the container and returns the created div.
   */
  private addTooltip(container: string):
      d3.Selection<HTMLDivElement, any, any, any> {
    console.log(
        d3.select(container).append('div').attr('class', TOOLTIP_CLASS));
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
  private closestGroupId(
      x: number, y: number, clusterIdToLoc: Map<number, Location>): number {
    const getDistance = (pos) => Math.sqrt(
        Math.pow(pos.xPosition - x, 2) + Math.pow(pos.yPosition - y, 2));
    const [closestId, distance] =
        Array.from(clusterIdToLoc.entries())
            .map(([id, pos]) => [id, getDistance(pos)])
            .reduce(
                ([closestId, closestDist], [currId, currDist]) =>
                    currDist < closestDist ? [currId, currDist] :
                                             [closestId, closestDist],
                [-1, Infinity]);
    return closestId;
  }

  /**
   * Adds to circle tooltip functionality (tooltip appears when the mouse is
   * over the circle and disapears when it moves).
   */
  private tooltipHandling(): void {
    const mousemove = (d) => {
      console.log(d3.event.pageY);
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
    console.log(d);
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
    this.changeBubbleCluster(d, this.clusterIdToLoc);
    this.applySimulation();
    d.fx = null;
    d.fy = null;
  }

  /** Changes bubble cluster based on current position. */
  private changeBubbleCluster(
      bubbleObj: CircleDatum, clusterIdToLoc: Map<number, Location>): void {
    const currentCluster: Cluster = this.clusters.get(bubbleObj.clusterId);
    // Get new ClusterId based on current position.
    bubbleObj.clusterId =
        this.closestGroupId(bubbleObj.x, bubbleObj.y, clusterIdToLoc);
    const newCluster: Cluster = this.clusters.get(bubbleObj.clusterId);
    currentCluster.moveBubble(bubbleObj, newCluster);
  }

  /**
   * Called from the dialog, updates the clusters based on the event chosen
   * new cluster and queries to move.
   */
  updateClustersBasedOnDialog(
      newCluster: Cluster, selections: any[], currCluster: Cluster,
      clusterly: ClusterlyComponent): void {
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
