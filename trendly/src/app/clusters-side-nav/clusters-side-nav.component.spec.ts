import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClustersSideNavComponent } from './clusters-side-nav.component';

describe('ClustersSideNavComponent', () => {
  let component: ClustersSideNavComponent;
  let fixture: ComponentFixture<ClustersSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClustersSideNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClustersSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
