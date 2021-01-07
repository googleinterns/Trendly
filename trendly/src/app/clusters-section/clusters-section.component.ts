//@ts-nocheck
import {SelectionModel} from '@angular/cdk/collections';
import {ThrowStmt} from '@angular/compiler';
import {Component, HostListener, Input, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {EventEmitter, KeyValueDiffer, KeyValueDiffers} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as d3 from 'd3';
import {truncate} from 'fs';

import {AddClusterDialogComponent} from '../add-cluster-dialog/add-cluster-dialog.component';
import {AddSimilarDialogComponent} from '../add-similar-dialog/add-similar-dialog.component';
import {ColorsService} from '../colors.service';
import {DeleteConfirmationDialogComponent} from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import {MergeDialogComponent} from '../merge-dialog/merge-dialog.component';
import {Bubble} from '../models/bubble-model';
import {CircleDatum} from '../models/circle-datum';
import {Cluster} from '../models/cluster-model';
import {ClusterDataObj} from '../models/server-datatypes';
import {QueriesDialogComponent} from '../queries-dialog/queries-dialog.component';

import {CLUSTERS_DATA} from './mock-data';

export const CLUSTERS_CONTAINER: string = '.clusters-container';
export const TOOLTIP_CLASS: string = 'bubble-tooltip';
const MAX_CLUSTERS = 0;
const LIGHT_CIRCLE_CLASS = 'light';
const DELETE_ID = -1;
const ADD_ID = -2;
const DELETE_CLUSTER = new Cluster('Trash (Delete)', -1, 0, [], [], []);
const DELETE_BTN_IMG = 'assets/img/delete-white-18dp.svg';
const ADD_BTN_IMG = 'assets/img/add-white-18dp.svg';
const MOVE_BTN_IMG = 'assets/img/open_with-white-24dp.svg';

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
  encapsulation: ViewEncapsulation.None
})

export class ClustersSectionComponent {
  private clusters: Map<number, Cluster> = new Map<number, Cluster>();
  @Output() clustersEmitter = new EventEmitter<Map<number, Cluster>>();
  @Output() displayedClustersEmitter = new EventEmitter<Map<number, Cluster>>();
  @Input() trendsData: ClusterDataObj;
  @Input() clustersToDisplay: Map<number, Cluster> = new Map<number, Cluster>();
  private clustersListDiffer: KeyValueDiffer<string, any>;
  private displayedClustersListDiffer: KeyValueDiffer<string, any>;
  private displayedClustersDiffer: Map<number, KeyValueDiffer<string, any>>;
  private queries: Array<Bubble> = new Array<Bubble>();
  readonly scales: Map<Scales, any> = new Map<Scales, any>();
  private circles: d3.Selection<SVGCircleElement, Bubble, SVGGElement, any>;
  private lightCircles:
      d3.Selection<SVGCircleElement, Bubble, SVGGElement, any>;
  private simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;
  private tooltip: d3.Selection<HTMLDivElement, any, any, any>;
  private svgContainer: d3.Selection<SVGSVGElement, any, any, any>;
  private clusterIdToLoc: Map<number, Location>;
  private maxQueryVolume: number = 0;
  private minQueryVolume: number = Infinity;
  private deleteLoc: Location = {xPosition: 0, yPosition: 0};
  private addLoc: Location = {xPosition: 0, yPosition: 0};
  @Input() isSideNavOpened: boolean;


  constructor(
      private colorsService: ColorsService, public queriesDialog: MatDialog,
      public addClusterDialog: MatDialog, public deleteDialog: MatDialog,
      public addSimilarDialog: MatDialog, private differs: KeyValueDiffers,
      public mergeDialog: MatDialog) {
    this.clustersListDiffer = this.differs.find(this.clusters).create();
    this.displayedClustersListDiffer =
        this.differs.find(this.clustersToDisplay).create();
    this.displayedClustersDiffer =
        new Map<number, KeyValueDiffer<string, any>>();
  }

  /**
   * On each change of the data received from the server, updates the
   * visualization.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const isUndefined = (obj) => typeof obj === 'undefined';
    // New data arrived from the server.
    if (changes['trendsData']) {
      const clustersData: ClusterDataObj =
          isUndefined(this.trendsData) ? [] : this.trendsData;
      if (isUndefined(this.svgContainer) || this.svgContainer.empty()) {
        this.svgContainer = this.addSvg(CLUSTERS_CONTAINER);
      } else {
        this.removeSvgContent();
      }
      this.processClustersObjects(clustersData);
    }
    // The list of clusters we need to display was changed through the side-nav.
    if (changes['clustersToDisplay']) {
      this.removeSvgContent();
      // If new cluster is added, load new visualization.
      if (!this.clusterIdToLoc || this.hasClusterAdded()) {
        this.addClustersVisualization();
      } else {  // Otherwise, keep the current location of the clusters.
        const clusterIdToDelete: number[] =
            Array.from(this.clusterIdToLoc.keys())
                .filter((id) => !this.clustersToDisplay.has(id) && id > 0);
        clusterIdToDelete.forEach((id) => this.clusterIdToLoc.delete(id));
        this.addClustersVisualization(
            this.clusterIdToLoc, this.scales.get(Scales.ColorScale),
            this.scales.get(Scales.LightColorScale));
      }
    }
    // The side-nav position had changed, need to update the svg size.
    if (changes['isSideNavOpened']) {
      if (!isUndefined(this.svgContainer)) {
        this.removeSvgContent();
        this.svgContainer.remove();
      }
      this.svgContainer = this.addSvg(CLUSTERS_CONTAINER);
      this.addClustersVisualization();
    }
  }

  /**
   * Returns true iff a new cluster is about to be added to the screen. (Appears
   * in the current clustersToDisplay but not in the previous clusterIdToLoc).
   */
  private hasClusterAdded(): boolean {
    for (clusterId in this.clustersToDisplay.keys()) {
      if (!this.clusterIdToLoc.has(clusterId)) return true;
    }
    return false;
  }

  /**
   * Handles changing svg's & clusters' size on window resize event.
   */
  @HostListener('window:resize')
  onResize() {
    this.removeSvgContent();
    this.svgContainer.remove();
    this.svgContainer = this.addSvg(CLUSTERS_CONTAINER);
    this.addClustersVisualization();
  }

  /**
   * Detects changes in the clusters list and objects in order to emit the new
   * clusters map to the clusters' sidenave.
   */
  ngDoCheck(): void {
    if (this.clustersListDiffer.diff(this.clusters)) {
      this.clustersEmitter.emit(this.clusters);
    }
    if (this.displayedClustersListDiffer.diff(this.clustersToDisplay)) {
      this.displayedClustersEmitter.emit(this.clustersToDisplay);
    }
    this.clustersToDisplay.forEach((cluster, id) => {
      if (this.displayedClustersDiffer.has(id) &&
          this.displayedClustersDiffer.get(id).diff(cluster)) {
        this.displayedClustersEmitter.emit(this.clustersToDisplay);
      }
    })
  }

  /** Initializes svg content. */
  private removeSvgContent(): void {
    this.svgContainer.selectAll('*').remove();
    if (!(typeof this.tooltip === 'undefined')) {
      this.tooltip.remove();
    }
  }
  /** Generates bubble clusters visualization based on the recieved data. */
  private addClustersVisualization(
      newClusterIdToLoc?, colorScale?, lightColorScale?): void {
    // If there are no cluster to be presented, no need for visualization.
    if (!this.clustersToDisplay || this.clustersToDisplay.size == 0) {
      return;
    }
    // Initialize current simulation if it's defined.
    (this.simulation) ? this.simulation.stop() : null;
    this.processQueries();
    this.addScales(colorScale, lightColorScale);

    // Map each cluster to its location on the screen.
    this.clusterIdToLoc =
        newClusterIdToLoc ? newClusterIdToLoc : this.gridDivision();
    // Initialize the circle group.
    const circleGroup: d3.Selection<SVGGElement, any, any, any> =
        this.addGroup();

    // Initialize outer and inner circle for each query circle.
    this.lightCircles = this.addCircles(
        circleGroup, LIGHT_CIRCLE_CLASS, 25, Scales.LightColorScale);
    this.circles = this.addCircles(circleGroup, '', 0, Scales.ColorScale);

    this.addClusterTitlesAndBtn(circleGroup);

    // Add tooltip with query string for each circle.
    this.tooltip = this.addTooltip(CLUSTERS_CONTAINER);
    this.tooltipHandling();

    // Apply force clustering simulation + dragging functionallity.
    this.simulation = this.addForceSimulation();
    this.applySimulation();
    this.applyDragging();
    this.applyQueriesDialog();

    // Add the buttons for adding new cluster / deleting bubble.
    this.addDelQueryBtn(circleGroup, 0, 0);
    this.addClusterBtn(circleGroup, 0, 0);
  }

  /**
   * Adds scales to this.scales to be used in this component functions.
   *  If specific colorScale/ lightColorScale is given, use them.
   */
  private addScales(colorScale?, lightColorScale?): void {
    // A scale that gives a radius size for each query based on its volume.
    this.scales.set(
        Scales.RadiusScale,
        d3.scaleSqrt()
            .domain([this.minQueryVolume, this.maxQueryVolume])
            .range([
              (window.innerWidth + window.innerHeight) / 120,
              (window.innerWidth + window.innerHeight) / 50
            ]));

    // A scale that gives a color for each bubble.
    this.scales.set(
        Scales.ColorScale,
        colorScale ?
            colorScale :
            d3.scaleOrdinal()
                .domain(Array.from(this.clustersToDisplay.keys()).map(String))
                .range(this.colorsService.colors));

    // A scale that gives a light color for each outer bubble.
    this.scales.set(
        Scales.LightColorScale,
        lightColorScale ?
            lightColorScale :
            d3.scaleOrdinal()
                .domain(Array.from(this.clustersToDisplay.keys()).map(String))
                .range(this.colorsService.lightColors));

    // A scale of the x position for each group.
    this.scales.set(
        Scales.XPositionSacle,
        d3.scaleLinear().domain([1, this.clustersToDisplay.size]).range([
          (this.isSideNavOpened ? window.innerWidth - 300 : window.innerWidth) /
              8,
          7 *
              (this.isSideNavOpened ? window.innerWidth - 300 :
                                      window.innerWidth) /
              8
        ]));
  }

  /**
   * Process the data recieved from the server and fills this.clusters,
   * this.queries.
   */
  private processClustersObjects(clustersData: ClusterDataObj): void {
    this.clusters = new Map<number, Cluster>();
    Object.values(clustersData).forEach((cluster) => {
      const newCluster: Cluster = new Cluster(
          cluster.title, cluster.id, cluster.volume, cluster.queriesToDisplay,
          cluster.additionalQueries, cluster.relatedClustersIds);
      this.clusters.set(newCluster.id, newCluster);
    });
  }

  /**
   * Updates this.queries, minQueryVolume, maxQueryVolume properties.
   */
  private processQueries(): void {
    this.queries = new Array<Bubble>();
    this.clustersToDisplay.forEach((cluster) => {
      cluster.bubbles.forEach((bubble) => {
        this.minQueryVolume = Math.min(this.minQueryVolume, bubble.volume);
        this.maxQueryVolume = Math.max(this.maxQueryVolume, bubble.volume);
        this.queries.push(bubble);
        this.displayedClustersDiffer.set(
            cluster.id, this.differs.find(cluster).create());
      });
    })
  }

  /**
   * Returns a map of cluster id to Location object containing the x and y
   * position for the center of each cluster.
   */
  private gridDivision(): Map<number, Location> {
    const height: number = window.innerHeight;
    const upperYPosition: number = Math.min(250, height / 3);
    const lowerYPosition: number = 1.75 * height / 3;
    const clusterIdToLoc: Map<number, Location> = new Map<number, Location>();
    let i: number = 1;
    this.clustersToDisplay.forEach((cluster) => {
      const x: number = this.scales.get(Scales.XPositionSacle)(i);
      const y: number = i % 2 === 1 ? upperYPosition : lowerYPosition;
      clusterIdToLoc.set(cluster.id, {xPosition: x, yPosition: y});
      i++;
    });
    // Location for the delete query button.
    clusterIdToLoc.set(DELETE_ID, this.deleteLoc);
    // Location for the add cluster button.
    clusterIdToLoc.set(ADD_ID, this.addLoc);
    return clusterIdToLoc;
  }

  /**
   * Adds a svg object to the container and returns the created svg.
   * The size of the svg dependes on the screen size and whether or no the
   * side-nav is oppened.
   */
  private addSvg(container: string):
      d3.Selection<SVGSVGElement, any, any, any> {
    return d3.select(container)
        .append('svg')
        .attr(
            'width',
            this.isSideNavOpened ? window.innerWidth - 300 :
                                   window.innerWidth + 300)
        .attr('height', window.innerHeight);
  }

  /**
   * Adds a group (g object) to the svgContainer and returns the created group.
   */
  private addGroup(): d3.Selection<SVGGElement, any, any, any> {
    return this.svgContainer.append('g').attr('class', 'circle-group');
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
      circleGroup: d3.Selection<SVGGElement, any, any, any>, id: string,
      radiusAddition: number, colorScale: Scales):
      d3.Selection<SVGCircleElement, Bubble, SVGGElement, any> {
    const circles =
        circleGroup.selectAll('g').data(this.queries).enter().append('circle');
    return this.updateCircleAttr(circles, id, radiusAddition, colorScale);
  }

  /**
   * Returns the given circles with the updated attributes of location, radius
   * and color.
   */
  private updateCircleAttr(
      circle: d3.Selection<SVGCircleElement, Bubble, SVGGElement, any>,
      id: string, radiusAddition: number, colorScale: Scales):
      d3.Selection<SVGCircleElement, Bubble, SVGGElement, any> {
    return circle.attr('class', (d, i) => 'circle' + i + id)
        .attr(
            'r',
            (d) => {
              d.r = this.scales.get(Scales.RadiusScale)(d.volume) +
                  radiusAddition;
              return d.r;
            })
        .attr('cx', (d) => this.clusterIdToLoc.get(d.clusterId).xPosition)
        .attr('cy', (d) => this.clusterIdToLoc.get(d.clusterId).yPosition)
        .style('fill', (d) => this.scales.get(colorScale)(d.clusterId))
  }

  /**
   * Returns the cluster id of the nearest clusr to the given x,y coordinates.
   */
  private closestGroupId(
      x: number, y: number, onlyRealId = false, restrictedId: number?): number {
    const getDistance = (pos) => Math.sqrt(
        Math.pow(pos.xPosition - x, 2) + Math.pow(pos.yPosition - y, 2));
    const [closestId, distance] =
        Array.from(this.clusterIdToLoc.entries())
            .filter(
                (entry) =>
                    entry[0] != restrictedId && (!onlyRealId || entry[0] > 0))
            .map(([id, pos]) => [id, getDistance(pos)])
            .reduce(
                ([closestId, closestDist], [currId, currDist]) =>
                    currDist < closestDist ? [currId, currDist] :
                                             [closestId, closestDist],
                [-3, Infinity]);
    return closestId;
  }

  /** Adds the clusters' titles as text above each group of bubbles */
  private addClusterTitlesAndBtn(
      circleGroup: d3.Selection<SVGGElement, any, any, any>): void {
    this.clusterIdToLoc.forEach((location, clusterID) => {
      // Validates it's a real cluster location (and not dummy one the delete/
      // add locations).
      if (clusterID > 0) {
        const x: number = location.xPosition - window.innerWidth / 80;
        const y: number = location.yPosition -
            Math.min(window.innerHeight / 4, 200) * (window.innerHeight / 1200);
        const nonDisplayedSimCluster: number[] =
            this.getNonDisplayedSimilar(clusterID);

        // Groups for title + buttons and for the buttons only.
        const titleGroup =
            circleGroup.append('g').attr('class', 'titles-container');
        const titleBtnGroup =
            titleGroup.append('g').attr('class', 'titles-btn-container');
        const moveBtn =
            titleGroup.append('g').attr('class', 'move-btn-container');

        this.BindTitlesAndBtn(
            titleGroup, titleBtnGroup, moveBtn, clusterID,
            nonDisplayedSimCluster, x, y);
      }
    });
  }

  /**
   * Binds the title and the buttons(similarity, delete and drag) buttons to
   * the clusters and the svg.
   */
  private BindTitlesAndBtn(
      titleGroup: d3.Selection<SVGGElement, any, any, any>,
      titleBtnGroup: d3.Selection<SVGGElement, any, any, any>,
      moveBtn: d3.Selection<SVGGElement, any, any, any>, clusterID: number,
      nonDisplayedSimCluster: number[], x: number, y: number): void {
    this.addTitle(
        titleGroup, this.clustersToDisplay.get(clusterID).title, x, y,
        clusterID);
    // Adds the + similar button only if exists new clusters to display.
    if (nonDisplayedSimCluster.length > 0)
      this.addSimilarBtn(
          titleBtnGroup, x - 30, y - 5, clusterID, nonDisplayedSimCluster);
    this.addDelClusterBtn(titleBtnGroup, x - 80, y - 5, clusterID);
    this.addMoveBtn(
        moveBtn,
        x +
            d3.select('#clusters-title-' + clusterID)
                .node()
                .textLength.baseVal.value +
            25,
        y - 5, clusterID);
  }

  /**
   * Update the final location of the cluster after was dragged.
   */
  private updateClusterIdToLocAfterDrag(clusterId): void {
    this.clusterIdToLoc.get(clusterId).xPosition = Math.min(
        Math.max(
            d3.mouse(this.svgContainer.node())[0],
            (this.isSideNavOpened ? window.innerWidth - 300 :
                                    window.innerWidth) /
                8),
        7 *
            (this.isSideNavOpened ? window.innerWidth - 300 :
                                    window.innerWidth) /
            8);
    this.clusterIdToLoc.get(clusterId).yPosition = Math.min(
        Math.max(d3.mouse(this.svgContainer.node())[1], window.innerHeight / 5),
        window.innerHeight * 5 / 6);
  }


  /**
   * Adds to titleBtnGroup the add similar clusters button (when clicked on adds
   * to the displayed clusters the related clusters ids).
   */
  private addMoveBtn(
      titleBtnGroup: d3.Selection<SVGGElement, any, any, any>, x: number,
      y: number, clusterID: number): void {
    const btnGroup =
        titleBtnGroup.append('g').attr('class', 'move-btn' + clusterID);
    btnGroup.append('svg:title').text('Move the Cluster');
    this.addBtnCircle(btnGroup, x, y);
    this.addBtnIcon(btnGroup, x - 10, y - 10, MOVE_BTN_IMG, 20);
    this.applyMoveDragging(titleBtnGroup, x, y, clusterID);
  }

  /**
   * Adds the dragging functionality to the move button (that attracts the
   * relevant clustr with him).
   */
  private applyMoveDragging(
      moveBtn: d3.Selection<SVGGElement, any, any, any>, x: number, y: number,
      clusterID: number): void {
    moveBtn
        .datum({
          x: (x +
              d3.select('#clusters-title-' + clusterID)
                  .node()
                  .textLength.baseVal.value +
              25),
          y: y - 5,
          clusterID: clusterID

        })
        .call(d3.drag()
                  .on('start', this.onDragMoveBtnStarted.bind(this))
                  .on('drag', this.onDragMoveBtn.bind(this))
                  .on('end', this.onDragMoveBtnEnded.bind(this)));
  }

  /**
   * Called when a cluster's drag starts and makes the needed changes for the
   * drag.
   */
  private onDragMoveBtnStarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select('#clusters-title-' + d.clusterID).attr('visibility', 'hidden');
    d3.selectAll('.titles-btn-container').attr('visibility', 'hidden');
    this.clusters.get(d.clusterID).isDragged = 1;
    if (d.x1 !== undefined) {
      d.x1 = d3.event.x - d.x;
      d.y1 = d3.event.y - d.y;
    } else {
      d.x1 = d3.event.x;
      d.y1 = d3.event.y;
    }
  }

  /**
   * Called on cluster's drag and changes the cluster location while dragging.
   */
  private onDragMoveBtn(d) {
    d.x = d3.event.x - d.x1;
    d.y = d3.event.y - d.y1;
    d3.select('.move-btn' + d.clusterID)
        .attr('transform', 'translate(' + (d.x) + ',' + (d.y) + ')');
    this.simulation.force('x').initialize(this.queries);
    this.simulation.force('y').initialize(this.queries);
  }

  /**
   * Called after a cluster's drag ended and makes all the relevant changes
   * (change cluster's location, merge if needed and update visualization).
   */
  private onDragMoveBtnEnded(d): void {
    this.clusters.get(d.clusterID).isDragged = 0;
    this.updateClusterIdToLocAfterDrag(d.clusterID);
    // Check if merged.
    const closestId = this.closestGroupId(
        this.clusterIdToLoc.get(d.clusterID).xPosition,
        this.clusterIdToLoc.get(d.clusterID).yPosition, true, d.clusterID);
    if (this.isOnOtherCluster(
            this.clusterIdToLoc.get(d.clusterID).xPosition,
            this.clusterIdToLoc.get(d.clusterID).yPosition, closestId)) {
      this.mergeDialog.open(MergeDialogComponent, {
        data: {
          clusterly: this,
          srcCluster: this.clusters.get(d.clusterID),
          destCluster: this.clusters.get(closestId)
        }
      });
    }
    this.removeSvgContent();
    this.addClustersVisualization(
        this.clusterIdToLoc, this.scales.get(Scales.ColorScale),
        this.scales.get(Scales.LightColorScale));
  }

  /**
   * Checks if one cluster is on other cluster after it was dragged (given it's
   * center).
   */
  private isOnOtherCluster(x: number, y: number, closestId: number): boolean {
    const area: (
        Bubble,
        ) => number = (bubble) => Math.PI * Math.pow(bubble.r, 2);
    const sumBubblesArea = [...this.clusters.get(closestId).bubbles].reduce(
        (sum, bubble) => sum + area(bubble), 0);
    const edgeLength = Math.sqrt(sumBubblesArea);
    return (
        Math.abs(x - this.clusterIdToLoc.get(closestId).xPosition) <=
            edgeLength / 2 &&
        Math.abs(y - this.clusterIdToLoc.get(closestId).yPosition) <=
            edgeLength / 2);
  }

  /**
   * Adds svg text element with the given title to titleGroup.
   */
  private addTitle(
      titleGroup, title: string, x: number, y: number,
      clusterID: number): void {
    titleGroup.append('text')
        .attr('class', 'clusters-titles')
        .attr('id', 'clusters-title-' + clusterID)
        .text(title)
        .attr('x', x)
        .attr('y', y);
  }

  /**
   * Adds to titleBtnGroup the add similar clusters button (when clicked on adds
   * to the displayed clusters the related clusters ids).
   */
  private addSimilarBtn(
      titleBtnGroup, x: number, y: number, clusterID: number,
      nonDisplayedSimCluster: number[]): void {
    const btnGroup = titleBtnGroup.append('g').on('click', d => {
      if (nonDisplayedSimCluster.length + this.clustersToDisplay.size >
          MAX_CLUSTERS) {
        this.openAddSimilarDialog(nonDisplayedSimCluster);
      } else {
        this.addRelatedClusters(nonDisplayedSimCluster);
      }
    });
    btnGroup.append('svg:title').text('Add Similar Clusters');
    this.addBtnCircle(btnGroup, x, y);
    this.addBtnText(titleBtnGroup, x, y, '+');
  }

  /**
   * Adds to titleBtnGroup the add similar clusters button (when clicked on
   * remove the cluster from the screen).
   */
  private addDelClusterBtn(titleBtnGroup, x: number, y: number): void {
    const btnGroup = titleBtnGroup.append('g').on(
        'click', d => {this.clustersToDisplay.delete(clusterID)});
    btnGroup.append('svg:title').text('Hide Cluster');
    this.addBtnCircle(btnGroup, x, y);
    this.addBtnText(titleBtnGroup, x, y, 'x');
  }

  /**
   * Adds to the svg the trash button that appears below the cluster of a bubble
   * that is currently being dragged, and allows to delete the bubble (and it
   * corresponding query).
   */
  private addDelQueryBtn(circlesBtnGroup, x: number, y: number): void {
    const radius = ((window.innerHeight + window.innerWidth) / 4200) * 33;
    const btnGroup = circlesBtnGroup.append('g')
                         .attr('class', 'delete-query-btn')
                         .attr('visibility', 'hidden');
    btnGroup.append('svg:title').text('Delete bubble');
    this.addBtnCircle(btnGroup, x, y).attr('r', radius);
    this.addBtnIcon(
        btnGroup, x - (radius / 2), y - (radius / 2), DELETE_BTN_IMG, radius);
  }

  /**
   * Adds to the svg the + button that appears below the cluster of a bubble
   * that is currently being dragged, and allows to add the bubble (and it
   * corresponding query) to a new cluster.
   */
  private addClusterBtn(circlesBtnGroup, x: number, y: number): void {
    const radius = ((window.innerHeight + window.innerWidth) / 4200) * 33;
    const btnGroup = circlesBtnGroup.append('g')
                         .attr('class', 'add-cluster-btn')
                         .attr('visibility', 'hidden');
    btnGroup.append('svg:title').text('Add to new cluster');
    this.addBtnCircle(btnGroup, x, y).attr('r', radius);
    this.addBtnIcon(
        btnGroup, x - (radius / 2), y - (radius / 2), ADD_BTN_IMG, radius);
  }

  /**
   * Handles adding the text component of the button.
   */
  private addBtnIcon(
      btnGroup, x: number, y: number, path: string, radius: number): void {
    btnGroup.append('image')
        .attr('width', radius)
        .attr('height', radius)
        .attr('x', x)
        .attr('y', y)
        .attr('xlink:href', path);
  }

  /**
   * Handles adding the circle component of the button.
   */
  private addBtnCircle(btnGroup, x: number, y: number):
      d3.Selection<SVGCircleElement, any, SVGGElement, any> {
    return btnGroup.append('circle')
        .attr('class', 'similar-clusters-btn')
        .attr('cx', x)
        .attr('cy', y)
  }

  /**
   * Handles adding the text component of the button.
   */
  private addBtnText(
      btnGroup, x: number, y: number, clusterID: number, text: string): void {
    btnGroup.append('text').attr('x', x).attr('y', y).text(text);
  }

  /**
   * Adds each of the cluster in the given relatedClustersIds to the list of
   * clusters to display.
   */
  addRelatedClusters(relatedClustersIds: number[]) {
    relatedClustersIds.forEach((id) => {
      this.clustersToDisplay.set(id, this.clusters.get(id));
    })
  }

  /**
   * Returns a list of clusters' ids in the related clusters to the given
   * cluster that aren't currently displayed.
   */
  private getNonDisplayedSimilar(clusterID: number): number[] {
    return this.clusters.get(clusterID).relatedClustersIds.filter(
        id => !this.clustersToDisplay.has(id));
  }

  /**
   * Handles openning the AddSimilarDialogComponent and transform to it the
   * relevant data.
   */
  private openAddSimilarDialog(relatedClustersIds: number[]): void {
    const clusters = relatedClustersIds.map(id => this.clusters.get(id));
    clusters.sort((cluster1, cluster2) => cluster2.volume - cluster1.volume);
    this.addSimilarDialog.open(
        AddSimilarDialogComponent,
        {data: {clusterly: this, clusters: clusters}});
  }
  /**
   * Adds to circle tooltip functionality (tooltip appears when the mouse is
   * over the circle and disapears when it moves).
   */
  private tooltipHandling(): void {
    const mousemove = (d) => {
      this.tooltip.html(d.query)
          .style(
              'left',
              (d3.event.pageX -
               (window.innerWidth / (5 * (window.innerWidth / 1300)))) +
                  'px')
          .style(
              'top',
              (d3.event.pageY -
               (window.innerHeight / ((window.innerHeight / 700) * 2))) +
                  'px');
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
        .force('x', d3.forceX().strength(0.4).x((d: CircleDatum) => {
          if (d.clusterId > 0 && this.clusters.get(d.clusterId).isDragged) {
            return d3.mouse(this.svgContainer.node())[0];
          } else {
            return this.clusterIdToLoc.get(d.clusterId).xPosition;
          }
        }))
        .force('y', d3.forceY().strength(0.4).y((d: CircleDatum) => {
          if (d.clusterId > 0 && this.clusters.get(d.clusterId).isDragged) {
            return d3.mouse(this.svgContainer.node())[1];
          } else {
            return this.clusterIdToLoc.get(d.clusterId).yPosition;
          }
        }))

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
      this.circles.attr('cx', (d: CircleDatum) => d.x)
          .attr('cy', (d: CircleDatum) => d.y)
          .style(
              'fill',
              (d) => d.clusterId == DELETE_ID ?
                  '#696969' :
                  this.scales.get(Scales.ColorScale)(d.clusterId));
      this.lightCircles.attr('cx', (d: CircleDatum) => d.x)
          .attr('cy', (d: CircleDatum) => d.y)
          .style(
              'fill',
              (d) => d.clusterId == DELETE_ID ?
                  '#a9a9a9' :
                  this.scales.get(Scales.LightColorScale)(d.clusterId));
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
    const yPosition: number = this.clusterIdToLoc.get(d.clusterId).yPosition +
        ((window.innerHeight / 700) * 125);
    const xPosition: number = this.clusterIdToLoc.get(d.clusterId).xPosition;
    const rightGap = (window.innerWidth / 2844) * 45;
    const leftGap = (window.innerWidth / 2844) * 60;

    d3.selectAll('.add-cluster-btn')
        .attr(
            'transform',
            'translate(' + (xPosition + rightGap) + ' ' + yPosition + ')')
        .attr('visibility', 'visible');
    this.deleteLoc.xPosition = xPosition - leftGap;
    this.deleteLoc.yPosition = yPosition;
    this.addLoc.xPosition = xPosition + rightGap;
    this.addLoc.yPosition = yPosition;
    d3.selectAll('.delete-query-btn')
        .attr(
            'transform',
            'translate(' + (xPosition - leftGap) + ' ' + yPosition + ')')
        .attr('visibility', 'visible');
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
    d3.select('.add-cluster-btn').attr('visibility', 'hidden');
    d3.select('.delete-query-btn').attr('visibility', 'hidden');
  }

  /** Changes bubble cluster based on current position. */
  private changeBubbleCluster(bubbleObj: CircleDatum): void {
    const currentCluster: Cluster = this.clusters.get(bubbleObj.clusterId);
    // Get new ClusterId based on current position
    const newID = this.closestGroupId(bubbleObj.x, bubbleObj.y);
    if (newID === DELETE_ID) {
      bubbleObj.clusterId = newID;
      this.openDeleteDialog(bubbleObj, currentCluster);
    } else if (newID === ADD_ID) {
      this.openAddClusterDialog(bubbleObj);
      currentCluster.bubbles.delete(bubbleObj);
    } else {
      const newCluster: Cluster = this.clusters.get(newID);
      currentCluster.moveBubble(bubbleObj, newCluster);
    }
  }

  /**
   * Called from the dialog, updates the clusters based on the event chosen
   * new cluster and queries to move.
   */
  updateClustersBasedOnDialog(
      newCluster: Cluster, selectedQueries: SelectionModel<Bubble>,
      currCluster: Cluster, clusterly: ClustersSectionComponent): void {
    selectedQueries.selected.forEach((bubble) => {
      if (newCluster.id === DELETE_ID) {
        bubble.clusterId = DELETE_ID;
        clusterly.applySimulation();
        clusterly.deleteCircle(bubble, currCluster);
      } else {
        currCluster.moveBubble(bubble, newCluster);
      }
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
  private openQueriesDialog(d: CircleDatum): void {
    const cluster: Cluster = this.clusters.get(d.clusterId);
    this.queriesDialog.open(QueriesDialogComponent, {
      data: {
        clusterly: this,
        currentCluster: cluster,
        clusters: [DELETE_CLUSTER].concat(
            Array.from(this.clustersToDisplay.values())),
        updateFunc: this.updateClustersBasedOnDialog,
      }
    });
  }

  /**
   * Called from the addClusterDialog, adds new cluster with the given title
   * and initialize visualization
   */
  private addCluster(
      title: string, clusterly: ClustersSectionComponent,
      query: CircleDatum): void {
    const newCluster: Cluster = new Cluster(
        title, clusterly.clusters.size + 1, query.volume,
        [{title: query.query, value: query.volume}], [], []);
    clusterly.clustersToDisplay.set(clusterly.clusters.size + 1, newCluster);
    clusterly.clusters.set(clusterly.clusters.size + 1, newCluster);
    clusterly.displayedClustersDiffer.set(
        newCluster.id, clusterly.differs.find(newCluster).create());
    (clusterly.simulation) ? clusterly.simulation.stop() : null;
    d3.selectAll('.' + TOOLTIP_CLASS).remove();
    clusterly.svgContainer.selectAll('*').remove();
    clusterly.addClustersVisualization();
    clusterly.addClusterDialog.closeAll();
  }

  /** Opens addClusterDialog (called when the + button is clicked) */
  openAddClusterDialog(bubbleObj: CircleDatum): void {
    this.addClusterDialog.open(AddClusterDialogComponent, {
      data: {
        addCluster: this.addCluster,
        clustersTitles:
            Array.from(this.clusters.values()).map((cluster) => cluster.title),
        clusterly: this,
        query: bubbleObj
      }
    });
  }

  /**
   * Deletes the circle d3 Object and corresponding bubble from the clusters
   * visualization (called from delete ).
   */
  deleteCircle(bubbleObj: Bubble, cluster: Cluster): void {
    cluster.bubbles.delete(bubbleObj);
    cluster.volume -= bubbleObj.volume;
    this.queries = this.queries.filter((value) => value !== bubbleObj);
    this.circles.filter((d: CircleDatum) => d.clusterId === DELETE_ID)
        .transition()
        .duration(1000)
        .attr('r', 0)
        .remove();
    this.lightCircles.filter((d: CircleDatum) => d.clusterId === DELETE_ID)
        .transition()
        .duration(1000)
        .attr('r', 0)
        .remove();
    this.deleteDialog.closeAll();
  }

  /**
   * Called when a user drag a bubble to the delete button, opens delete
   * confirmation dialog.
   */
  private openDeleteDialog(bubbleObj: CircleDatum, cluster: Cluster): void {
    this.deleteDialog.open(
        DeleteConfirmationDialogComponent,
        {data: {cluster: cluster, bubble: bubbleObj, clusterly: this}});
  }

  /**
   * Called when a user click "No" on the delete confirmation dialog. Returns
   * the bubble to its original clusters and close the dialog.
   */
  closeDeleteDialog(bubleObj: CircleDatum, id: number): void {
    this.deleteDialog.closeAll();
    bubleObj.clusterId = id;
    this.applySimulation();
  }

  /**
   * Merges one cluster into another.
   */
  mergeClusters(srcCluster: Cluster, destCluster: Cluster): void {
    srcCluster.moveAllBubbles(destCluster);
    this.mergeDialog.closeAll();
    this.clustersToDisplay.delete(srcCluster.id);
  }

  /**
   * Updates the bubbles' data structures after the user make a query visible.
   */
  makeQueryVisible(bubble: Bubble, cluster: Cluster): void {
    bubble.x = this.clusterIdToLoc.get(cluster.id).xPosition;
    bubble.y = this.clusterIdToLoc.get(cluster.id).yPosition;
    cluster.additionalBubbles.delete(bubble);
    cluster.bubbles.add(bubble);
    this.queries.push(bubble);
    this.updateCircles();
  }

  /**
   * Updates the bubbles' data structures after the user make a query invisible.
   */
  makeQueryInvisible(bubble: Bubble, cluster: Cluster): void {
    cluster.bubbles.delete(bubble);
    cluster.additionalBubbles.add(bubble);
    this.queries = this.queries.filter((value) => value !== bubble);
    this.updateCircles();
  }

  /**
   * Updates the bubbles display(svg content) after the user make a query
   * visible / invisible.
   */
  private updateCircles() {
    this.removeSvgContent();
    if (this.clustersToDisplay && this.clustersToDisplay.size > 0) {
      this.addClustersVisualization(
          this.clusterIdToLoc, this.scales.get(Scales.ColorScale),
          this.scales.get(Scales.LightColorScale));
    }
  }
}
