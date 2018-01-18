import { Boss } from './../../shared/models/boss';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BsModalService } from 'ngx-bootstrap';
import { User } from './../../shared/models/user';
import { Subscription } from 'rxjs/Subscription';
import { Pending } from './../../shared/models/pending';
import { UserService } from 'app/shared/services/user.service';
import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  pendings: Pending[] = []
  userSub: Subscription;
  pendingsSub: Subscription;
  solicitudesSub: Subscription;
  pending: Pending;
  bosses: Boss[];

  public modalRef: BsModalRef;

  constructor(
    private userService: UserService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUserObservable().subscribe((user: User) => {
      if (this.pendingsSub) {
        this.pendingsSub.unsubscribe();
      }
      if (user.selectedBoss) {
        this.pendingsSub = this.pendingsSub = this.userService.getPendings(user.selectedBoss)
          .subscribe((pendings: Pending[]) => {
            this.pendings = pendings;
          }, error => {

          });
      }

      if (this.solicitudesSub) {
        this.solicitudesSub.unsubscribe();
      }
      this.solicitudesSub = this.userService.getSolicitudes().subscribe((bossesIds) => {
        this.bosses = [];
        bossesIds.forEach((elem) => {
          let userKey = elem.key;
          let solicitudeKey = elem.key;
          this.userService.getBoss(userKey).then((bossJson) => {
            var boss = Object.assign(new Boss(), bossJson.val())
            boss.userKey = userKey;
            boss.solicitudeKey = solicitudeKey;
            this.bosses.push(boss)
          });
        })
      }, error => {

      })
    })
  }

  getLabel(pending: Pending) {
    return (pending.priority == 0) ? 'green-label' : (pending.priority == 1) ?
      'yellow-label' : 'red-label';
  }

  public openModal(template: TemplateRef<any>, pending: Pending) {
    this.pending = Object.assign(new Pending(), pending);
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy() {
    if (this.pendingsSub) {
      this.pendingsSub.unsubscribe();
    }
    this.userSub.unsubscribe()
  }
}
