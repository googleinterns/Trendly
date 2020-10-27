import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable} from 'rxjs';

import {InputObj} from '../clusterly-inputs/clusterly-inputs.component';
import {DataService} from '../data.service';
import {Cluster} from '../models/cluster-model';
import {MatTableDataSource} from '@angular/material/table';

/**
 * Clusterly component - includes Clusterly inputs & clusters-section
 * components and handles fetching data from server based on the user inputs and
 * transfering the returnd data to the relevant component.
 */
@Component({
  selector: 'app-clusterly',
  templateUrl: './clusterly.component.html',
  styleUrls: ['./clusterly.component.css']
})
export class ClusterlyComponent {
  dataFromServer: any;
  isLoading: boolean = false;

  clusters: Map<number, Cluster> = new Map<number, Cluster>();
  clustersToShow: Map<number, Cluster>;
  displayedColumns: string[] = ['select', 'title', 'volume'];
  dataSource : MatTableDataSource<Cluster>;
  selection = new SelectionModel<Cluster>(true, []);

  private selectedID: Set<number> = new Set<number>();


  constructor(private dataService: DataService) {
    this.clustersToShow = new Map<number, Cluster>();
    this.dataSource = new MatTableDataSource<Cluster>([...this.clusters.values()]);
  }

  changeView(): void {
    const sortedClusters: Map<number, Cluster> = new Map(
        [...this.clusters.entries()].sort((a, b) => b[1].volume - a[1].volume));
    this.dataSource = new MatTableDataSource<Cluster>([...sortedClusters.values()]);
  }

  getDataFromServer(input: InputObj) {
    this.isLoading = true;
    this.dataService
        .fetchClustrlyData(
            input['terms'], input['startDate'], input['endDate'],
            input['country'], 1, input['category'])
        .subscribe(
            (data) => {
              this.dataFromServer = {...data};
              this.isLoading = false;
            },
            (err) => {
              console.log(err);
              alert(
                  'An error occurred while processing your request. Please try again.')
            });
  }

  ItemToggle(row) {
    this.selection.toggle(row);
    this.updateClustersToShow();
  }

  private updateClustersToShow() : void {
    this.clustersToShow = new Map<number, Cluster>();
    this.selection.selected.forEach((cluster) => {
      this.clustersToShow.set(cluster.id, cluster);
    })
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach((row) => this.selection.select(row));
  }

}
