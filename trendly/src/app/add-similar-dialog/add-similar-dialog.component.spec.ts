import {OverlayContainer} from '@angular/cdk/overlay';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {Cluster} from '../models/cluster-model';

import {AddSimilarDialogComponent, SimilarDialogData} from './add-similar-dialog.component';


const CLUSTER1: Cluster =
    new Cluster('Cluster1 title', 1, 100, [{title: '', value: 1}], [], []);
const CLUSTER2: Cluster =
    new Cluster('Cluster2 title', 1, 100, [{title: '', value: 1}], [], []);
const CLUSTERS: Cluster[] = [CLUSTER1, CLUSTER2];

const DATA: SimilarDialogData = {
  clusters: CLUSTERS,
  clusterly: null
};
const CONFIG = {
  data: DATA
};

const DIALOG_TITLE = 'Add Similar Clusters:';
const DIALOG_CONTENT = '(Make sure not to choose too many clusters)';
const FIRST_CLUSTER_OPTION = ' Cluster1 title ';
const SECOND_CLUSTER_OPTION = ' Cluster2 title ';

describe('AddSimilarDialogComponent', () => {
  let component: AddSimilarDialogComponent;
  let fixture: ComponentFixture<AddSimilarDialogComponent>;
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [AddSimilarDialogComponent],
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
    fixture = TestBed.createComponent(AddSimilarDialogComponent);
    dialog = TestBed.get(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create dialog\'s title correctly', () => {
    dialog.open(AddSimilarDialogComponent, CONFIG);
    fixture.detectChanges();
    const h1 = overlayContainerElement.querySelector('.mat-dialog-title');
    expect(h1.textContent).toBe(DIALOG_TITLE);
  });

  it('should create dialog\'s table that match the given clusters', () => {
    (component as any).dataSource = new MatTableDataSource<Cluster>(CLUSTERS);
    dialog.open(AddSimilarDialogComponent, CONFIG);
    fixture.detectChanges();
    const matList = overlayContainerElement.querySelectorAll('mat-cell');
    expect(matList.item(1).textContent).toBe(FIRST_CLUSTER_OPTION);
    expect(matList.item(4).textContent).toBe(SECOND_CLUSTER_OPTION);
  });

  it('should create dialog\'s content correctly', () => {
    dialog.open(AddSimilarDialogComponent, CONFIG);
    fixture.detectChanges();
    const dialogCont =
        overlayContainerElement.querySelector('.mat-dialog-content');
    expect(dialogCont.textContent.includes(DIALOG_CONTENT)).toBeTrue();
  });
});
