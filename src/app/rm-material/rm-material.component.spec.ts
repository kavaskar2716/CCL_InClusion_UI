import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RMMaterialComponent } from './rm-material.component';

describe('RMMaterialComponent', () => {
  let component: RMMaterialComponent;
  let fixture: ComponentFixture<RMMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RMMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RMMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
