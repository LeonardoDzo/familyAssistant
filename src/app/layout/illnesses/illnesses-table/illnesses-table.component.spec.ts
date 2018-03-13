import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllnessesTableComponent } from './illnesses-table.component';

describe('IllnessesTableComponent', () => {
  let component: IllnessesTableComponent;
  let fixture: ComponentFixture<IllnessesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IllnessesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllnessesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
