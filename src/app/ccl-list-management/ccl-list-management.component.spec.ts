import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CclListManagementComponent } from './ccl-list-management.component';

describe('CclListManagementComponent', () => {
  let component: CclListManagementComponent;
  let fixture: ComponentFixture<CclListManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CclListManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CclListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
