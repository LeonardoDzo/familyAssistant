import { Subscription } from 'rxjs/Subscription';
import { User } from './../../../shared/models/user';
import { UserService } from 'app/shared/services/user.service';
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

  assistant: User = new User()

  userSub: Subscription

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUserObservable().subscribe((user: User) => {
      this.assistant = user
    })
    this.userService.openChat(this.boss)
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
    this.userService.destroy()
  }

  getDateString(time: number) {
    var date = new Date(time)
    return date.toLocaleString('es-mx', {weekday: 'short'}) + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  toggle() {
    this.chatState = (this.chatState === 'out') ? 'in' : 'out';
    if(this.chatState == 'in'){
      this.userService.openChat(this.boss)
      this.boss.unread = 0
    }
  }

  closeChat() {
    let ind = this.chats.indexOf(this.boss);
    this.chats.splice(ind,1)
  }

  getMessages(): any[] {
    if(this.boss.messages)
      return this.boss.messages.sort((a,b) => {
        return a.timestamp - b.timestamp
      })
    else
      return []
  }

  sendMessage() {
    if(this.message){
      this.userService.sendMessage(this.boss,this.message)
      this.message =  ""
    }
  }

  onFocus() {
    this.boss.unread = 0
    this.userService.openChat(this.boss)    
  }
}
