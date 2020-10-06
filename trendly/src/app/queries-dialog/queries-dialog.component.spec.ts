import {OverlayContainer} from '@angular/cdk/overlay';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {Bubble} from '../models/bubble-model';
import {Cluster} from '../models/cluster-model';
import {DialogData, QueriesDialogComponent} from './queries-dialog.component';

const CLUSTER1: Cluster =
    new Cluster('Cluster1 title', 1, [{title: '', volume: 1}]);
const CLUSTER2: Cluster =
    new Cluster('Cluster2 title', 1, [{title: '', volume: 1}]);
const QUERIES: Bubble[] =
    [new Bubble('query 1', 10, 1), new Bubble('query 2', 15, 2)];
const DATA: DialogData = {
  currentCluster: CLUSTER1,
  queries: QUERIES,
  clusters: [CLUSTER1, CLUSTER2]
};
const CONFIG = {
  data: DATA
};
const DIALOG_TITLE = 'Topic: Cluster1 title';
const FIRST_QUERY_OPTION = ' query 1 (volume: 10) ';
const SECOND_QUERY_OPTION = ' query 2 (volume: 15) ';

describe('QueriesDialogComponent', () => {
  let component: QueriesDialogComponent;
  let fixture: ComponentFixture<QueriesDialogComponent>;
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [QueriesDialogComponent],
          imports: [MatDialogModule, BrowserAnimationsModule],
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

  /** Checks dialog title was created with the given cluster title */
  it('check dialog title', () => {
    dialog.open(QueriesDialogComponent, CONFIG);
    fixture.detectChanges();
    const h1 = overlayContainerElement.querySelector('.mat-dialog-title');
    expect(h1.textContent).toBe(DIALOG_TITLE);
  });

  /** Checks dialog select list options match given queries */
  it('check dialog select list options', () => {
    dialog.open(QueriesDialogComponent, CONFIG);
    fixture.detectChanges();
    const matList = overlayContainerElement.querySelectorAll('mat-list-option');
    expect(matList.item(0).textContent).toBe(FIRST_QUERY_OPTION);
    expect(matList.item(1).textContent).toBe(SECOND_QUERY_OPTION);
  });

  /** Checks dialog select cluster titles options match given clusters */
  it('check dialog select cluster titles options', () => {
    dialog.open(QueriesDialogComponent, CONFIG);
    fixture.detectChanges();
    const matForm = overlayContainerElement.querySelector('mat-select');
    expect(matForm.textContent).toBe(CLUSTER1.title + CLUSTER2.title);
  });
});
