import { User } from 'app/shared/models/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Illness } from '../models/illness';
import { Injectable } from '@angular/core';

@Injectable()
export class IllnessService {
  assistant: User;
  constructor(
    private afd: AngularFireDatabase,
    private afa: AngularFireAuth
  ) { 
    this.getUser().subscribe((user: User) => {
      this.assistant = user;
    })
  }

  getIllnesses() {
    let uid = this.assistant.selectedBoss;
    return this.afd.list('illnesses/' + uid).snapshotChanges()
  }

  getUser() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.object(`assistants/${uid}`).valueChanges();
  }

  addIllness(illness: Illness) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref("illnesses/" + uid).push(illness);
  }

  editIllness(illness: Illness) {
    let uid = this.assistant.selectedBoss;;
    this.afd.database.ref("illnesses/" + uid + "/" + illness.key).update({
      nombre: illness.nombre,
      masinfo: illness.masinfo,
      dosis: illness.dosis,
      medicine: illness.medicine
    })
  }

  removeIllness(illness: Illness) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref("illnesses/" + uid + "/" + illness.key).remove()
  }

}
