import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from 'app/router.animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  animations: [routerTransition()]
})
export class TodoComponent implements OnInit {
  public modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
