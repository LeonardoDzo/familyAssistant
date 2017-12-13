import { User } from './../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class CrudService {
  table: string
  assistant: User
  constructor(
    private afd: AngularFireDatabase,
    private afa: AngularFireAuth
  ) { 
    this.getUser().subscribe((user: User) => {
      this.assistant = user;
    });
  }

  setTable(table: string) {
    this.table = table
  }

  getUser() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.object(`assistants/${uid}`).valueChanges();
  }

  addObject(obj: any) {
    let uid = this.assistant.familyActive;
    this.afd.database.ref(this.table + "/" + uid).push(obj);
  }

  getObjects() {
    let uid = this.assistant.familyActive;
    return this.afd.list(this.table + "/" + uid).snapshotChanges()
  }

  editObject(obj: any) {
    let uid = this.assistant.familyActive;
    this.afd.database.ref(this.table + "/" + uid + "/" + obj.key).update(obj)
  }

  removeObject(obj: any) {
    let uid = this.assistant.familyActive;
    this.afd.database.ref(this.table + "/" + uid + "/" + obj.key).remove()
  }
}
