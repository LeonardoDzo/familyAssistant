import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificatioionsComponent } from './notificatioions.component';

describe('NotificatioionsComponent', () => {
  let component: NotificatioionsComponent;
  let fixture: ComponentFixture<NotificatioionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificatioionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificatioionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
