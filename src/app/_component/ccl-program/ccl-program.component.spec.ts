import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CclProgramComponent } from './ccl-program.component';

describe('CclProgramComponent', () => {
  let component: CclProgramComponent;
  let fixture: ComponentFixture<CclProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CclProgramComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CclProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
