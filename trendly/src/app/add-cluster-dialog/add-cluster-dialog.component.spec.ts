import {OverlayContainer} from '@angular/cdk/overlay';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AddClusterDialogComponent, AddClusterDialogData} from './add-cluster-dialog.component';

const DATA: AddClusterDialogData = {
  addCluster: null,
  clustersTitles: [],
  clusterly: null
};
const CONFIG = {
  data: DATA
};
const DIALOG_TITLE = 'Add a Cluster';
const DIALOG_CONTENT = 'Please choose a title for the new cluster:';

describe('AddClusterDialogComponent', () => {
  let component: AddClusterDialogComponent;
  let fixture: ComponentFixture<AddClusterDialogComponent>;
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [AddClusterDialogComponent],
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
    fixture = TestBed.createComponent(AddClusterDialogComponent);
    dialog = TestBed.get(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create dialog\'s title correctly', () => {
    dialog.open(AddClusterDialogComponent, CONFIG);
    fixture.detectChanges();
    const h1 = overlayContainerElement.querySelector('.mat-dialog-title');
    expect(h1.textContent).toBe(DIALOG_TITLE);
  });

  it('should create dialog\'s content correctly', () => {
    dialog.open(AddClusterDialogComponent, CONFIG);
    fixture.detectChanges();
    const h1 = overlayContainerElement.querySelector('.mat-dialog-content');
    expect(h1.textContent.includes(DIALOG_CONTENT)).toBeTrue;
  });
});
