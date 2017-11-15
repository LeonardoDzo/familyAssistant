import { Pending } from './../models/pending';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { UUID } from 'angular2-uuid';

@Injectable()
export class TodoService {

  constructor(
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase,
    public app: FirebaseApp
  ) { }

  addPending(pending: Pending) {
    let uid = this.afa.auth.currentUser.uid;
    let key = this.afd.database.ref("todo/" + uid).push({
      dateTime: pending.date.getTime(),
      name: pending.name,
      description: pending.description,
      active: (pending.active) ? pending.active: false
    }).key;

    if(pending.file) {
      this.upload(pending.file,uid,key)
    }
  }

  removePending(pending: Pending) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref("todo/" + uid + "/" + pending.key).remove()
  }

  updatePending(pending: Pending) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref("todo/" + uid + "/" + pending.key).update({
      dateTime: pending.date.getTime(),
      name: pending.name,
      description: pending.description,
      active: (pending.active) ? pending.active: false
    });

    if(pending.file) {
      this.upload(pending.file,uid,pending.key)
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

  getPendings() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.list("todo/" + uid).snapshotChanges()
  }

}
