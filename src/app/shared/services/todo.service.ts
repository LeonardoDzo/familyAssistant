import { User } from 'app/shared/models/user';
import { Event } from './../models/event';
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

  addEvent(event: Event) {
    let uid = this.assistant.selectedBoss;
    let key = this.afd.database.ref("todo/" + uid).push({
      dateTime: event.date.getTime(),
      name: event.name,
      description: event.description,
      active: (event.active) ? event.active: false
    }).key;

    if(event.file) {
      this.upload(event.file,uid,key)
    }
  }

  removeEvent(event: Event) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref("todo/" + uid + "/" + event.key).remove()
  }

  updateEvent(event: Event) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref("todo/" + uid + "/" + event.key).update({
      dateTime: event.date.getTime(),
      name: event.name,
      description: event.description,
      active: (event.active) ? event.active: false
    });

    if(event.file) {
      this.upload(event.file,uid,event.key)
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

  getEvents() {
    let uid = this.assistant.selectedBoss;
    return this.afd.list("todo/" + uid).snapshotChanges()
  }

}
