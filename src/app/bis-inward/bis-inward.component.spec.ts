import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BisInwardComponent } from './bis-inward.component';

describe('BisInwardComponent', () => {
  let component: BisInwardComponent;
  let fixture: ComponentFixture<BisInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BisInwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BisInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
