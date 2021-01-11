import {Component, OnInit} from '@angular/core';
import {Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

import {ClustersSectionComponent} from '../clusters-section/clusters-section.component';
import {Cluster} from '../models/cluster-model';

export interface MergeDialogData {
  srcCluster: Cluster;
  destCluster: Cluster;
  clusterly: ClustersSectionComponent;
}

/**
 * Merge confirmation dialog. (Asks the user if he's sure he wans to merge the
 * cluster they dragged into the other cluster and acts based on his response).
 */
@Component({
  selector: 'app-merge-dialog',
  templateUrl: './merge-dialog.component.html',
  styleUrls: ['./merge-dialog.component.css']
})
export class MergeDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MergeDialogData) {}
}
