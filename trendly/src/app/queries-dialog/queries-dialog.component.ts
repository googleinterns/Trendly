import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Bubble } from '../models/bubble-model';

export interface DialogData {
  title: String;
  queries: Bubble[];
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
