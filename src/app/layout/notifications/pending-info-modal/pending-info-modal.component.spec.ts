import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingInfoModalComponent } from './pending-info-modal.component';

describe('PendingInfoModalComponent', () => {
  let component: PendingInfoModalComponent;
  let fixture: ComponentFixture<PendingInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
