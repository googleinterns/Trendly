import {SelectionModel} from '@angular/cdk/collections';
import {Component, ViewEncapsulation} from '@angular/core';
import {Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';

import {ClusterlyComponent} from '../clusterly/clusterly.component';
import {ClustersSectionComponent} from '../clusters-section/clusters-section.component';
import {Bubble} from '../models/bubble-model';
import {Cluster} from '../models/cluster-model';

export interface DialogData {
  clusterly?: ClustersSectionComponent;
  currentCluster: Cluster;
  clusters: Cluster[];
  updateFunc?:
      (newCluster: Cluster, selections: SelectionModel<Bubble>,
       currCluster: Cluster, clusterly: ClustersSectionComponent) => void;
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
})
export class QueriesDialogComponent {
  selectedCluster: Cluster;
  readonly displayedColumns: string[] =
      ['select', 'query', 'volume', 'visibility'];
  readonly dataSource: MatTableDataSource<Bubble>;
  readonly selectedQueries: SelectionModel<Bubble> =
      new SelectionModel<Bubble>(true, []);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dataSource = new MatTableDataSource<Bubble>(
        Array.from(data.currentCluster.bubbles)
            .concat(Array.from(data.currentCluster.additionalBubbles))
            .sort((bubble1, bubble2) => bubble2.volume - bubble1.volume));
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
