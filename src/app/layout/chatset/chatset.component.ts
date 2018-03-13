import { element } from 'protractor';
import { User } from './../../shared/models/user';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { Subscription } from 'rxjs';
import { Boss } from 'app/shared/models/boss';

@Component({
  selector: 'app-chatset',
  templateUrl: './chatset.component.html',
  styleUrls: ['./chatset.component.scss']
})
export class ChatsetComponent implements OnInit {
  userSub: Subscription
  bosses: Boss[] = []
  chats: Boss[] = []
  assistant: User = new User();
  constructor(
    private userService: UserService
  ) { }

  readMessages(boss: Boss) {
    this.userService.getMessages(boss).on('child_added',message => {
      if(this.assistant.bosses[boss.id] < message.val().timestamp && message.val().remittent == boss.id){
        boss.unread++;
        var ind = this.chats.findIndex(elem => {
          return elem.id == boss.id
        })
        if(ind == -1) {
          this.chats.push(boss)
        }
      }
      boss.messages.push(message.val())
    })
  }

  ngOnInit() {
    this.userSub = this.userService.getUserObservable().subscribe((user: User) => {
      this.assistant = user;
    })

    this.userService.getBossesAdded().on("child_added", bossSnap => {
      this.userService.getBoss(bossSnap.key).then(bossJson => {
        var boss = Object.assign(new Boss(),bossJson.val())
        boss.messages = []
        boss.unread = 0
        this.readMessages(boss)
        this.bosses.push(boss)
      })
    })
    this.userService.getBossesAdded().on('child_removed', bossSnap => {
      var ind = this.bosses.findIndex(elem => {
        return elem.id == bossSnap.key
      })
      this.bosses.splice(ind,1)
    })
    /*.subscribe(bosses => {
      let promisses = []
      this.bosses = []
      bosses.forEach(elem => {
        promisses.push(this.userService.getBoss(elem.key).then(bossJson => {
          var boss = Object.assign(new Boss(),bossJson.val())
          boss.messages = []
          boss.unread = 0
          this.readMessages(boss)
          this.bosses.push(boss)
        }))
      })
    })*/
  }
  ngOnDestroy() {
    this.userSub.unsubscribe()
    this.userService.destroy()
  }
}
