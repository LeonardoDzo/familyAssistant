import { Insurance } from './../models/insurance';
import { User } from './../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { UUID } from 'angular2-uuid';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class InsurancesService {
  sub: Subscription
  assistant: User;
  constructor(
    private afd: AngularFireDatabase,
    private afa: AngularFireAuth,
    public app: FirebaseApp
  ) {
    this.sub = this.getUser().subscribe((user: User) => {
      this.assistant = user;
    }, error => {

    })
  }

  destroy() {
    this.sub.unsubscribe();
  }

  getUser() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.object(`assistants/${uid}`).valueChanges();
  }

  getInsurances() {
    let uid = this.assistant.selectedBoss;
    return this.afd.list(`insurances/${uid}`).valueChanges();
  }

  private getExt(name: string): string {
    return name.split('.').pop();
  }

  upload(ref,file: File,uid: string) {
    var storageRef = this.app.storage().ref()
    var uuid = UUID.UUID();
    var ext = this.getExt(file.name)
    var fileRef = storageRef.child('insurances/' + uid + "/" + uuid + "." + ext)
    fileRef.put(file).then((snapshot) => {
      ref.update({
        downloadUrl: snapshot.downloadURL
      });
    });
  }

  addInsurance(insurance: Insurance,file: File) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref(`insurances/${uid}`).push(insurance).then(ref => {
      ref.update({
        id: ref.key
      }).then(() => {
        if(file)
          this.upload(ref,file,uid)
      })
    })
  }

  update(insurance: Insurance,file: File) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref(`insurances/${uid}/${insurance.id}`).update(insurance).then(() => {
      if(file)
        this.upload(this.afd.database.ref(`insurances/${uid}/${insurance.id}`),file,uid)
    })
  }

  removeInsurance(id: string) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref(`insurances/${uid}/${id}`).remove()
  }
}
