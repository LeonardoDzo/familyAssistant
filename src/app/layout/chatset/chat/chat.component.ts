import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { Boss } from 'app/shared/models/boss';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chatState: string = 'in'
  @Input()
  id: string

  @Input()
  boss: Boss;

  @Input()
  chats: Boss[];

  message: string

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var objDiv = document.getElementById(this.id);
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  toggle() {
    this.chatState = (this.chatState === 'out') ? 'in' : 'out';
  }

  closeChat() {
    let ind = this.chats.indexOf(this.boss);
    this.chats.splice(ind,1)
  }

  sendMessage() {
    console.log(this.message)
  }
}
