import {Component} from '@angular/core';
import {Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';

import {ClusterlyComponent} from '../clusterly/clusterly.component'
import {Bubble} from '../models/bubble-model';
import {Cluster} from '../models/cluster-model';

export interface DialogData {
  clusterly?: ClusterlyComponent;
  currentCluster: Cluster;
  queries: Bubble[];
  clusters: Cluster[];
  updateFunc?:
      (newCluster: Cluster, selections: any[], currCluster: Cluster,
       clusterly: ClusterlyComponent) => void;
}

/**
 * Dialog component, responsible for displaying a dialog containing information
 * about the given cluster and the queries belongs to it + the possibility to
 * move queries from one cluster to another.
 */

@Component({
  selector: 'app-queries-dialog',
  templateUrl: './queries-dialog.component.html',
  styleUrls: ['./queries-dialog.component.css']
})
export class QueriesDialogComponent {
  selectedCluster: Cluster;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  selected(event: MatSelectChange) {
    this.selectedCluster = event.value;
  }
}
