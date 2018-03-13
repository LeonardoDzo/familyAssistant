import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoModalComponent } from './event-info-modal.component';

describe('EventInfoModalComponent', () => {
  let component: EventInfoModalComponent;
  let fixture: ComponentFixture<EventInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
