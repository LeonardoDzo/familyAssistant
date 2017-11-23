import { Subscription } from 'rxjs/Subscription';
import { TodoService } from './../../shared/services/todo.service';
import { Event } from './../../shared/models/event';
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
  event: Event = new Event();
  events: Event[];
  sub: Subscription;
  months = ["En", "Febr", "Mzo", 
            "Abr", "May", "Jun", 
            "Jul", "Agto", "Sept",
            "Oct", "Nov", "Dic"]
  constructor(
    private modalService: BsModalService,
    private todoService: TodoService,
  ) { }

  private init() {
    this.todoService.getEvents().subscribe((snapshot) => {
      let events: Event[] = [];
      snapshot.forEach((elem) => {
        let event = Object.assign(new Event(),elem.payload.toJSON());
        event.date = new Date(event.dateTime);
        event.key = elem.key
        events.push(event);
      });

      events.sort((a,b) => {
        return a.dateTime - b.dateTime;
      });

      this.events = events;
    });
  }

  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: "theme-red" });

    this.todoService.getUser().subscribe(() => {
      this.init();
    })
  }

  public openModal(template: TemplateRef<any>, event: Event = new Event()) {
    this.event = Object.assign(new Event(),event);
    this.modalRef = this.modalService.show(template);
  }

  fileChanged(files: any){
    this.event.file = files[0];
  }

  removeEvent() {
    this.todoService.removeEvent(this.event);
    this.modalRef.hide();
  }

  submitModal() {
    if(!this.event.key)
      this.todoService.addEvent(this.event)
    else
      this.todoService.updateEvent(this.event)
    this.modalRef.hide()
  }

}
