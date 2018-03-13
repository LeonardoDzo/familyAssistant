import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContactModalComponent } from './new-contact-modal.component';

describe('NewContactModalComponent', () => {
  let component: NewContactModalComponent;
  let fixture: ComponentFixture<NewContactModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewContactModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
