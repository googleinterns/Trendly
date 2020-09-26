import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Bubble } from '../models/bubble-model';
import { Cluster } from '../models/cluster-model';
import { ClusterlyComponent } from '../clusterly/clusterly.component'


export interface DialogData {
  clusterly: ClusterlyComponent;
  simulation,
  currentCluster: Cluster;
  queries: Bubble[];
  clusters: Cluster[];
  updateFunc: (event, selections, currCluster, clusterly, simulation, circle, lightCircle)=>void;
  circle;
  lightCircle;
}

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
