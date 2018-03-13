import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllnessInfoModalComponent } from './illness-info-modal.component';

describe('IllnessInfoModalComponent', () => {
  let component: IllnessInfoModalComponent;
  let fixture: ComponentFixture<IllnessInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IllnessInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllnessInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
