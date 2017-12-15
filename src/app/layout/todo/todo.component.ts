import { Subscription } from 'rxjs/Subscription';
import { TodoService } from './../../shared/services/todo.service';
import { Todo } from './../../shared/models/todo';
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
  todo: Todo = new Todo();
  todos: Todo[];
  userSub: Subscription;
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
    if(this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.todoService.getTodos().subscribe((snapshot) => {
      let todos: Todo[] = [];
      snapshot.forEach((elem) => {
        let todo = Object.assign(new Todo(),elem.payload.toJSON());
        todo.date = new Date(todo.dateTime);
        todo.key = elem.key
        todos.push(todo);
      });

      todos.sort((a,b) => {
        return a.dateTime - b.dateTime;
      });

      this.todos = todos;
    });
  }

  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: "theme-red" });

    this.userSub = this.todoService.getUser().subscribe(() => {
      this.init();
    })
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
    this.userSub.unsubscribe();
    this.todoService.destroy();
  }

  public openModal(template: TemplateRef<any>, todo: Todo = new Todo()) {
    this.todo = Object.assign(new Todo(),todo);
    this.modalRef = this.modalService.show(template);
  }

  fileChanged(files: any){
    this.todo.file = files[0];
  }

  removeTodo() {
    this.todoService.removeTodo(this.todo);
    this.modalRef.hide();
  }

  submitModal() {
    if(!this.todo.key)
      this.todoService.addTodo(this.todo)
    else
      this.todoService.updateTodo(this.todo)
    this.modalRef.hide()
  }

}
