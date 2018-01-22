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
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getBosses().subscribe(bosses => {
      let promisses = []
      this.bosses = []
      bosses.forEach(elem => {
        promisses.push(this.userService.getBoss(elem.key).then(bossJson => {
          this.bosses.push(Object.assign(new Boss(),bossJson.val()))
        }))
      })
    })
  }

}
