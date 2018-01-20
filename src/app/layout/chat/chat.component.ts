import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(0, 87%, 0)'
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out'))
    ]),
  ]
})
export class ChatComponent implements OnInit {
  chatState: string = 'out'
  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.chatState = (this.chatState === 'out') ? 'in' : 'out';
  }
}
