import {Component, OnInit} from '@angular/core';
import {Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

import {ClustersSectionComponent} from '../clusters-section/clusters-section.component';
import {CircleDatum} from '../models/circle-datum';
import {Cluster} from '../models/cluster-model';

export interface DeleteDialogData {
  cluster: Cluster;
  bubble: CircleDatum;
  clusterly: ClustersSectionComponent;
}

/**
 * Delete confirmation dialog. (Asks the user if he's sure he wans to delete the
 * query-bubble and acts based on his response).
 */
@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {}
}
