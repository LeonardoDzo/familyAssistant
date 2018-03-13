import { Component, OnInit, trigger, state, style, transition, animate, Input } from '@angular/core';
import { Boss } from 'app/shared/models/boss';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input()
  bosses: Boss[] = []
  @Input()
  chats: Boss[] = []
  chatState = 'out'
  show=true
  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.chatState = (this.chatState === 'out') ? 'in' : 'out';
  }

  chatClicked(boss: Boss) {
    if(this.chats.indexOf(boss) == -1){
      this.chats.push(boss)
    }
  }
}
