import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueriesDialogComponent } from './queries-dialog.component';

describe('QueriesDialogComponent', () => {
  let component: QueriesDialogComponent;
  let fixture: ComponentFixture<QueriesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueriesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
