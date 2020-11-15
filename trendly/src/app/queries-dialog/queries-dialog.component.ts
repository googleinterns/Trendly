import {SelectionModel} from '@angular/cdk/collections';
import {Component, ViewEncapsulation} from '@angular/core';
import {Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';

import {ClusterlyComponent} from '../clusterly/clusterly.component';
import {Bubble} from '../models/bubble-model';
import {Cluster} from '../models/cluster-model';

export interface DialogData {
  clusterly?: ClusterlyComponent;
  currentCluster: Cluster;
  queries: Bubble[];
  clusters: Cluster[];
  updateFunc?:
      (newCluster: Cluster, selections: SelectionModel<Bubble>,
       currCluster: Cluster, clusterly: ClusterlyComponent) => void;
}

/**
 * Dialog component, responsible for displaying a dialog containing information
 * about the given cluster and the queries belongs to it + the possibility to
 * move queries from one cluster to another.
 */

@Component({
  selector: 'app-queries-dialog',
  templateUrl: './queries-dialog.component.html',
  styleUrls: ['./queries-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QueriesDialogComponent {
  selectedCluster: Cluster;
  readonly displayedColumns: string[] = ['select', 'query', 'volume'];
  readonly dataSource: MatTableDataSource<Bubble>;
  readonly selectedQueries: SelectionModel<Bubble> =
      new SelectionModel<Bubble>(true, []);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dataSource = new MatTableDataSource<Bubble>(data.queries);
  }

  /**
   * Returns true iff the number of selected elements matches the total number
   * of rows.
   */
  isAllSelected(): boolean {
    return this.selectedQueries.selected.length === this.dataSource.data.length;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle(): void {
    this.isAllSelected() ?
        this.selectedQueries.clear() :
        this.dataSource.data.forEach(row => this.selectedQueries.select(row));
  }
}
