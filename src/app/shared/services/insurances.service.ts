import { User } from './../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class InsurancesService {
  assistant: User;
  constructor(
    private afd: AngularFireDatabase,
    private afa: AngularFireAuth
  ) {
    this.getUser().subscribe((user: User) => {
      this.assistant = user;
    }, error => {

    })
  }

  getUser() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.object(`assistants/${uid}`).valueChanges();
  }

  getInsurances() {
    let uid = this.assistant.selectedBoss;
    return this.afd.list(`insurances/${uid}`).valueChanges();
  }

}
