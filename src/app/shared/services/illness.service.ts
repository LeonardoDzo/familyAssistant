import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Illness } from '../models/illness';
import { Injectable } from '@angular/core';

@Injectable()
export class IllnessService {

  constructor(
    private afd: AngularFireDatabase,
    private afa: AngularFireAuth
  ) { }

  getIllnesses() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.list('illnesses/' + uid).snapshotChanges()
  }

  addIllness(illness: Illness) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref("illnesses/" + uid).push(illness);
  }

  editIllness(illness: Illness) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref("illnesses/" + uid + "/" + illness.key).update({
      nombre: illness.nombre,
      masinfo: illness.masinfo,
      dosis: illness.dosis,
      medicine: illness.medicine
    })
  }

  removeIllness(illness: Illness) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref("illnesses/" + uid + "/" + illness.key).remove()
  }

}
