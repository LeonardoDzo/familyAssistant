import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancesPanelComponent } from './insurances-panel.component';

describe('InsurancesPanelComponent', () => {
  let component: InsurancesPanelComponent;
  let fixture: ComponentFixture<InsurancesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurancesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
