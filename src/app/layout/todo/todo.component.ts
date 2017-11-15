import { TodoService } from './../../shared/services/todo.service';
import { Pending } from './../../shared/models/pending';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { routerTransition } from 'app/router.animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  animations: [routerTransition()]
})
export class TodoComponent implements OnInit {
  public modalRef: BsModalRef;
  bsValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  pending: Pending = new Pending();
  pendings: Pending[];

  months = ["En", "Febr", "Mzo", 
            "Abr", "May", "Jun", 
            "Jul", "Agto", "Sept",
            "Oct", "Nov", "Dic"]
  constructor(
    private modalService: BsModalService,
    private todoService: TodoService,
  ) { }

  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: "theme-red" });

    this.todoService.getPendings().subscribe((snapshot) => {
      let pendings: Pending[] = [];
      snapshot.forEach((elem) => {
        let pending = Object.assign(new Pending(),elem.payload.toJSON());
        pending.date = new Date(pending.dateTime);
        pending.key = elem.key
        pendings.push(pending)
      });

      pendings.sort((a,b) => {
        return a.dateTime - b.dateTime;
      });

      this.pendings = pendings;
    });

  }

  public openModal(template: TemplateRef<any>, pending: Pending = new Pending()) {
    this.pending = Object.assign(new Pending(),pending);
    this.modalRef = this.modalService.show(template);
  }

  fileChanged(files: any){
    this.pending.file = files[0];
  }

  removePending() {
    this.todoService.removePending(this.pending);
    this.modalRef.hide();
  }

  submitModal() {
    if(!this.pending.key)
      this.todoService.addPending(this.pending)
    else
      this.todoService.updatePending(this.pending)
    this.modalRef.hide()
  }

}
