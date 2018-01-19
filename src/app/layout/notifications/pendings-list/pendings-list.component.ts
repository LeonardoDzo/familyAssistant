import { UserService } from 'app/shared/services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BsModalService } from 'ngx-bootstrap';
import { Pending } from './../../../shared/models/pending';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-pendings-list',
  templateUrl: './pendings-list.component.html',
  styleUrls: ['./pendings-list.component.scss']
})
export class PendingsListComponent implements OnInit {
  @Input()
  pendings: Pending[] = [];

  pending: Pending

  public modalRef: BsModalRef;
  
  constructor(
    private modalService: BsModalService,
    private userService: UserService,
  ) { }

  getLabel(pending: Pending) {
    return (pending.priority == 0) ? 'green-label' : (pending.priority == 1) ?
      'yellow-label' : 'red-label';
  }

  public openModal(template: TemplateRef<any>, pending: Pending) {
    this.pending = Object.assign(new Pending(), pending);
    this.modalRef = this.modalService.show(template);
    if(!pending.seen)
      this.userService.seePending(pending.id)
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.userService.destroy()
  }

}
