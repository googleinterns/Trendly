import {SelectionModel} from '@angular/cdk/collections';
import {Component} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {InputObj} from '../clusterly-inputs/clusterly-inputs.component';
import {DataService} from '../data.service';
import {Cluster} from '../models/cluster-model';
/**
 * Clusterly component - includes Clusterly inputs, clusters-section and
 * clusters components and handles fetching data from server based on the user
 * inputs and transfering the returnd data to the relevant component. It also
 * contains side nav which allows the user to see all clusters and pick the ones
 * they want to display on the screen.
 */
@Component({
  selector: 'app-clusterly',
  templateUrl: './clusterly.component.html',
  styleUrls: ['./clusterly.component.css'],
})
export class ClusterlyComponent {
  dataFromServer: any;
  isLoading: boolean = false;
  clusters: Map<number, Cluster> = new Map<number, Cluster>();
  clustersToShow: Map<number, Cluster>;
  readonly displayedColumns: string[] = ['select', 'title', 'volume'];
  dataSource: MatTableDataSource<Cluster>;
  readonly selection: SelectionModel<Cluster> =
      new SelectionModel<Cluster>(true, []);

  constructor(private dataService: DataService) {
    this.clustersToShow = new Map<number, Cluster>();
    this.dataSource =
        new MatTableDataSource<Cluster>([...this.clusters.values()]);
  }

  /**
   * Changes side-nav view according changes that done in the UI.
   */
  changSideNavClusters(): void {
    const sortedClusters: Map<number, Cluster> = new Map(
        [...this.clusters.entries()].sort((a, b) => b[1].volume - a[1].volume));
    this.dataSource =
        new MatTableDataSource<Cluster>([...sortedClusters.values()]);
  }

  /**
   * Executed when changes done in cluster section and updates accordingly the
   * selections and clusters to show.
   * @param newClustersToShow list of clusters to show from the child
   *     cluster-section.
   */
  changeInUiHandler(newClustersToShow: Map<number, Cluster>): void {
    this.changSideNavClusters();
    console.log(this.clustersToShow);
    let hasChanged: boolean = false;
    this.dataSource.data.forEach((cluster => {
      if ((this.selection.isSelected(cluster) &&
           !newClustersToShow.has(cluster.id)) ||
          (!this.selection.isSelected(cluster) &&
           newClustersToShow.has(cluster.id))) {
        this.selection.toggle(cluster);
        hasChanged = true;
      }
    }));
    (hasChanged) ? this.updateClustersToShow() : null;
  }

  /**
   * Gets data from the server and updates the dataFromServer property.
   */
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

  /**
   * Change the row selection when clicked and accordingly updates the clusters
   * to show.
   */
  itemToggle(row): void {
    this.selection.toggle(row);
    this.updateClustersToShow();
  }

  /**
   * Updates clusters to show according the selections.
   */
  private updateClustersToShow(): void {
    this.clustersToShow = new Map<number, Cluster>();
    this.selection.selected.forEach((cluster) => {
      this.clustersToShow.set(cluster.id, cluster);
    })
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle(): void {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach((row) => this.selection.select(row));
    this.updateClustersToShow();
  }
}
