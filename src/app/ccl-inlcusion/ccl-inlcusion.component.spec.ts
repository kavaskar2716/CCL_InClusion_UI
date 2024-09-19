import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CclInlcusionComponent } from './ccl-inlcusion.component';

describe('CclInlcusionComponent', () => {
  let component: CclInlcusionComponent;
  let fixture: ComponentFixture<CclInlcusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CclInlcusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CclInlcusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
