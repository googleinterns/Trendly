//@ts-nocheck
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import * as d3 from 'd3';

import {ColorsService} from '../colors.service'
import {Bubble} from '../models/bubble-model'
import {Cluster} from '../models/cluster-model'
import {ClusterData, QueryData} from '../models/server-datatypes'
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
  readonly circles;
  readonly lightCircles;
  readonly simulation;

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
    const clusterIdToLoc: Map<number, Location> = this.gridDivision();

    // Append the svg object to the cluster container.
    const svgContainer = this.addSvg(CLUSTERS_CONTAINER);

    // Initialize the circle group.
    const circleGroup = this.addGroup(svgContainer);

    // Initialize outer and inner circle for each query circle.
    const lightCircle = this.addCircles(
        circleGroup, LIGHT_CIRCLE_CLASS, 25, clusterIdToLoc,
        Scales.LightColorScale);
    this.circles =
        this.addCircles(circleGroup, '', 0, clusterIdToLoc, Scales.ColorScale);

    // Add tooltip with query string for each circle.
    const tooltip = this.addTooltip(CLUSTERS_CONTAINER);
    this.tooltipHandling(tooltip);

    // Apply force clustering simulation + dragging functionallity.
    this.simulation = this.addForceSimulation(clusterIdToLoc);
    this.applySimulation();
    this.applyDragging(tooltip, clusterIdToLoc);
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
            .domain(Array.from(this.clusters.keys()))
            .range(this.colorsService.colors));

    // A scale that gives a light color for each outer bubble.
    this.scales.set(
        Scales.LightColorScale,
        d3.scaleOrdinal()
            .domain(Array.from(this.clusters.keys()))
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
  private addSvg(container: string) {
    return d3.select(container)
        .append('svg')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight);
  }

  /**
   * Adds a group (g object) to the svgContainer and returns the created group.
   */
  private addGroup(svgContainer) {
    return svgContainer.append('g');
  }

  /**
   * Adds a tooltip div to the container and returns the created div.
   */
  private addTooltip(container: string) {
    return d3.select(container).append('div').attr('class', TOOLTIP_CLASS)
  }

  /**
   * Adds circles bind to this.queries to circleGroup and returns the created
   * circles.
   */
  private addCircles(
      circleGroup, id: string, radiusAddition: number,
      clusterIdToLoc: Map<number, Location>, colorScale: Scales) {
    return circleGroup.selectAll('g')
        .data(this.queries)
        .enter()
        .append('circle')
        .attr('class', (d, i) => 'circle' + i + id)
        .attr(
            'r',
            (d) =>
                this.scales.get(Scales.RadiusScale)(d.volume) + radiusAddition)
        .attr('cx', (d) => clusterIdToLoc.get(d.clusterId).xPosition)
        .attr('cy', (d) => clusterIdToLoc.get(d.clusterId).yPosition)
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
  private tooltipHandling(tooltip): void {
    const mousemove = (event, d) => {
      tooltip.html(d.query)
          .style('left', (d3.pointer(event)[0] + 40) + 'px')
          .style('top', (d3.pointer(event)[1]) + 75 + 'px');
    };
    this.circles
        .on('mouseover',
            () => {
              tooltip.style('display', 'inline');
            })
        .on('mousemove', mousemove)
        .on('mouseleave', () => {
          tooltip.style('display', 'none');
        })
  }

  /**
   * Returns force simulation (x and y positions, centrering  and anti-collide).
   */
  private addForceSimulation(clusterIdToLoc: Map<number, Location>) {
    return d3.forceSimulation()
        .force(
            'x',
            d3.forceX().strength(0.5).x(
                (d) => clusterIdToLoc.get(d.clusterId).xPosition))
        .force(
            'y',
            d3.forceY().strength(0.5).y(
                (d) => clusterIdToLoc.get(d.clusterId).yPosition))
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
                    (d) => this.scales.get(Scales.RadiusScale)(d.volume) + 1)
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
  private applyDragging(
      simulation, tooltip, circle, lightCircle,
      clusterIdToLoc: Map<number, Location>): void {
    const clusterly = this;

    this.circles.call(d3.drag()
                          .on('start', dragstarted)
                          .on('drag', dragged)
                          .on('end', dragended));
    this.lightCircles.call(d3.drag()
                               .on('start', dragstarted)
                               .on('drag', dragged)
                               .on('end', dragended));

    function dragstarted(event, d): void {
      if (!event.active) {
        clusterly.simulation.alphaTarget(.03).restart();
      }
      tooltip.style('display', 'none');
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d): void {
      tooltip.style('display', 'none');
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d): void {
      if (!event.active) {
        clusterly.simulation.alphaTarget(.03);
      }
      tooltip.style('display', 'none');
      clusterly.changeBubbleCluster(this, d, clusterIdToLoc);
      clusterly.applySimulation();
      d.fx = null;
      d.fy = null;
    }
  }

  /** Changes bubble cluster based on current position. */
  private changeBubbleCluster(circle, bubbleObj, clusterIdToLoc): void {
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
      clusterly: ClusterlyComponent) {
    selections.forEach((option) => {
      const bubble: Bubble = option._value;
      currCluster.moveBubble(bubble, newCluster);
    });
    clusterly.applySimulation();
    clusterly.queriesDialog.closeAll();
  }

  /**
   * Adds a dialog with the queries belongs to a specific cluster
   * when the user click on a bubble.
   */
  private applyQueriesDialog() {
    this.circles.on('click', openQueriesDialog);
    this.lightCircles.on('click', openQueriesDialog);

    const clusterly: ClusterlyComponent = this;

    function openQueriesDialog(event, d) {
      const cluster: Cluster = clusterly.clusters.get(d.clusterId);
      const sortedQueries: Bubble[] =
          Array.from(cluster.bubbles)
              .sort((bubble1, bubble2) => bubble2.volume - bubble1.volume);

      clusterly.queriesDialog.open(QueriesDialogComponent, {
        data: {
          clusterly: clusterly,
          currentCluster: cluster,
          queries: sortedQueries,
          clusters: Array.from(clusterly.clusters.values()),
          updateFunc: clusterly.updateClustersBasedOnDialog,
        }
      });
    }
  }
}
