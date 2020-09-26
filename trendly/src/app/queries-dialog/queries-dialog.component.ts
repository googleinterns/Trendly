import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { Bubble } from '../models/bubble-model';
import { Cluster } from '../models/cluster-model';
import { ClusterlyComponent } from '../clusterly/clusterly.component'

export interface DialogData {
  clusterly?: ClusterlyComponent;
  currentCluster: Cluster;
  queries: Bubble[];
  clusters: Cluster[];
  updateFunc?: (event: MatSelectChange, selections: any[],
    currCluster: Cluster, clusterly: ClusterlyComponent)=>void;
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
export class QueriesDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

}
