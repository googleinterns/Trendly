import {OverlayContainer} from '@angular/cdk/overlay';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Cluster} from '../models/cluster-model';
import {MergeDialogComponent, MergeDialogData} from './merge-dialog.component';

const SRC_CLUSTER =
    new Cluster('src cluster', 1, 100, [{title: '', value: 1}], [], []);
const DST_CLUSTER =
    new Cluster('destination cluster', 1, 100, [{title: '', value: 1}], [], []);

const DATA: MergeDialogData = {
  srcCluster: SRC_CLUSTER,
  destCluster: DST_CLUSTER,
  clusterly: null
};

const CONFIG = {
  data: DATA
};
const DIALOG_TITLE = 'Merge Confirmation';
const DIALOG_CONTENT =
    ' Are you sure you want to merge cluster src cluster into cluster destination cluster? YesNo';

describe('MergeDialogComponent', () => {
  let component: MergeDialogComponent;
  let dialog: MatDialog;
  let fixture: ComponentFixture<MergeDialogComponent>;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [MergeDialogComponent],
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
    fixture = TestBed.createComponent(MergeDialogComponent);
    dialog = TestBed.get(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create merge dialog\'s title correctly', () => {
    dialog.open(MergeDialogComponent, CONFIG);
    fixture.detectChanges();
    const h1 = overlayContainerElement.querySelector('.mat-dialog-title');
    expect(h1.textContent).toBe(DIALOG_TITLE);
  });

  it('should create merge dialog\'s content correctly', () => {
    dialog.open(MergeDialogComponent, CONFIG);
    fixture.detectChanges();
    const h1 = overlayContainerElement.querySelector('.mat-dialog-content');
    expect(h1.textContent).toBe(DIALOG_CONTENT);
  });
});
