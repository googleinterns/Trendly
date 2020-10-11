import {OverlayContainer} from '@angular/cdk/overlay';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DeleteConfirmationDialogComponent, DeleteDialogData} from './delete-confirmation-dialog.component';

const DATA: DeleteDialogData = {
  cluster: null,
  bubble: null,
  clusterly: null
};
const CONFIG = {
  data: DATA
};
const DIALOG_TITLE = 'Delete Confirmation';
const DIALOG_CONTENT =
    ' Are you sure you want to delete this bubble-query? YesNo';

describe('DeleteConfirmationDialogComponent', () => {
  let component: DeleteConfirmationDialogComponent;
  let dialog: MatDialog;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponent>;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [DeleteConfirmationDialogComponent],
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
    fixture = TestBed.createComponent(DeleteConfirmationDialogComponent);
    dialog = TestBed.get(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create dialog\'s title correctly', () => {
    dialog.open(DeleteConfirmationDialogComponent, CONFIG);
    fixture.detectChanges();
    const h1 = overlayContainerElement.querySelector('.mat-dialog-title');
    expect(h1.textContent).toBe(DIALOG_TITLE);
  });

  it('should create dialog\'s content correctly', () => {
    dialog.open(DeleteConfirmationDialogComponent, CONFIG);
    fixture.detectChanges();
    const h1 = overlayContainerElement.querySelector('.mat-dialog-content');
    expect(h1.textContent).toBe(DIALOG_CONTENT);
  });
});
