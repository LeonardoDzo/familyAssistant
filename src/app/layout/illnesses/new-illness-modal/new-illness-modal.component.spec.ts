import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIllnessModalComponent } from './new-illness-modal.component';

describe('NewIllnessModalComponent', () => {
  let component: NewIllnessModalComponent;
  let fixture: ComponentFixture<NewIllnessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewIllnessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIllnessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
