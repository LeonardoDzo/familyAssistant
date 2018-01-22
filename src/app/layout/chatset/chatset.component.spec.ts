import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsetComponent } from './chatset.component';

describe('ChatsetComponent', () => {
  let component: ChatsetComponent;
  let fixture: ComponentFixture<ChatsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
