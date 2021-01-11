import {OverlayContainer} from '@angular/cdk/overlay';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {Bubble} from '../models/bubble-model';
import {Cluster} from '../models/cluster-model';

import {DialogData, QueriesDialogComponent} from './queries-dialog.component';

const CLUSTER1: Cluster =
    new Cluster('Cluster1 title', 1, 100, [{title: '', value: 1}], [], []);
const CLUSTER2: Cluster =
    new Cluster('Cluster2 title', 1, 100, [{title: '', value: 1}], [], []);
const QUERIES: Bubble[] =
    [new Bubble('query 1', 10, 1), new Bubble('query 2', 15, 2)];
const DATA: DialogData = {
  currentCluster: CLUSTER1,
  clusters: [CLUSTER1, CLUSTER2]
};
const CONFIG = {
  data: DATA
};
const DIALOG_TITLE = 'Topic: Cluster1 title';
const FIRST_QUERY_OPTION = ' query 1 ';
const SECOND_QUERY_OPTION = ' query 2 ';

describe('QueriesDialogComponent', () => {
  let component: QueriesDialogComponent;
  let fixture: ComponentFixture<QueriesDialogComponent>;
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [QueriesDialogComponent],
          imports: [
            MatDialogModule,
            BrowserAnimationsModule,
            MatTableModule,
          ],
          providers: [
            {provide: MAT_DIALOG_DATA, useValue: DATA}, {
              provide: OverlayContainer,
              useFactory: () => {
                overlayContainerElement = document.createElement('div');
                return {getContainerElement: () => overlayContainerElement};
              }
            }
          ]
        })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueriesDialogComponent);
    dialog = TestBed.get(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create queries\' dialog\'s title correctly (with the cluster title)',
     () => {
       dialog.open(QueriesDialogComponent, CONFIG);
       fixture.detectChanges();
       const h1 = overlayContainerElement.querySelector('.mat-dialog-title');
       expect(h1.textContent).toBe(DIALOG_TITLE);
     });

  it('should create queries\' select options thay match the clusters\' titles',
     () => {
       dialog.open(QueriesDialogComponent, CONFIG);
       fixture.detectChanges();
       const matForm = overlayContainerElement.querySelector('mat-select');
       expect(matForm.textContent).toBe(CLUSTER1.title + CLUSTER2.title);
     });
});
