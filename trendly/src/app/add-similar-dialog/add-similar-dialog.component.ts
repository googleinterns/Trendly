import {SelectionModel} from '@angular/cdk/collections';
import {Component, ViewEncapsulation} from '@angular/core';
import {Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';

import {ClustersSectionComponent} from '../clusters-section/clusters-section.component';
import {Cluster} from '../models/cluster-model';

export interface SimilarDialogData {
  clusterly?: ClustersSectionComponent;
  clusters: Cluster[];
}

/**
 * Dialog components that let the user choose which of the similar clusters he
 * want to add to the screen.
 */
@Component({
  selector: 'app-add-similar-dialog',
  templateUrl: './add-similar-dialog.component.html',
  styleUrls: ['./add-similar-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddSimilarDialogComponent {
  readonly displayedColumns: string[] = ['select', 'title', 'volume'];
  readonly dataSource: MatTableDataSource<Cluster>;
  readonly selectedClusters: SelectionModel<Cluster> =
      new SelectionModel<Cluster>(true, []);

  constructor(@Inject(MAT_DIALOG_DATA) public data: SimilarDialogData) {
    this.dataSource = new MatTableDataSource<Cluster>(data.clusters);
    this.dataSource.data.forEach(
        cluster => this.selectedClusters.select(cluster));
  }

  /**
   * Returns true iff the number of selected elements matches the total number
   * of rows.
   */
  isAllSelected(): boolean {
    return this.selectedClusters.selected.length ===
        this.dataSource.data.length;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle(): void {
    this.isAllSelected() ?
        this.selectedClusters.clear() :
        this.dataSource.data.forEach(
            cluster => this.selectedClusters.select(cluster));
  }

  /**
   * Calls to clusters-section addRelatedClusters and sends the ids' list of the
   * selected clusters.
   */
  sendSelectedIds(): void {
    this.data.clusterly.addRelatedClusters(
        this.selectedClusters.selected.map(cluster => cluster.id));
    this.data.clusterly.addSimilarDialog.closeAll();
  }
}
