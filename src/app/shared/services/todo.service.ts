import { User } from 'app/shared/models/user';
import { Todo } from './../models/todo';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { UUID } from 'angular2-uuid';

@Injectable()
export class TodoService {
  assistant: User;
  constructor(
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase,
    public app: FirebaseApp
  ) { 
    this.getUser().subscribe((user: User) => {
      this.assistant = user;
    })
  }

  getUser() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.object(`assistants/${uid}`).valueChanges();
  }

  addTodo(todo: Todo) {
    let uid = this.assistant.selectedBoss;
    let key = this.afd.database.ref("todo/" + uid).push({
      dateTime: todo.date.getTime(),
      name: todo.name,
      description: todo.description,
      active: (todo.active) ? todo.active: false
    }).key;

    if(todo.file) {
      this.upload(todo.file,uid,key)
    }
  }

  removeTodo(todo: Todo) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref("todo/" + uid + "/" + todo.key).remove()
  }

  updateTodo(todo: Todo) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref("todo/" + uid + "/" + todo.key).update({
      dateTime: todo.date.getTime(),
      name: todo.name,
      description: todo.description,
      active: (todo.active) ? todo.active: false
    });

    if(todo.file) {
      this.upload(todo.file,uid,todo.key)
    }
  }

  private getExt(name: string): string {
    return name.split('.').pop();
  }

  upload(file: File,uid: string,key: string) {
    var ref = this.app.storage().ref()
    var ext = this.getExt(file.name)
    var uuid = UUID.UUID();
    var imageRef = ref.child('todo/' + uid + "/" + uuid + "." + ext)
    imageRef.put(file).then((snapshot) => {
      this.afd.database.ref("todo/" + uid + "/" + key).update({
        downloadUrl: snapshot.downloadURL
      });
    });
  }

  getTodos() {
    let uid = this.assistant.selectedBoss;
    return this.afd.list("todo/" + uid).snapshotChanges()
  }

}
