import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterlyInputsComponent } from './clusterly-inputs.component';

describe('ClusterlyInputsComponent', () => {
  let component: ClusterlyInputsComponent;
  let fixture: ComponentFixture<ClusterlyInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClusterlyInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterlyInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
