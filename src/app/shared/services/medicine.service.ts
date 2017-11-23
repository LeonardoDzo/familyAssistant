import { User } from 'app/shared/models/user';
import { Medicine } from '../models/medicine';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';

@Injectable()
export class MedicineService {
  assistant: User;
  
  constructor(
    private afd: AngularFireDatabase,
    private afa: AngularFireAuth
  ) { 
    this.getUser().subscribe((user: User) => {
      this.assistant = user;
    });
  }

  getUser() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.object(`assistants/${uid}`).valueChanges();
  }

  addMedicine(medicine: Medicine) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref("medicine/" + uid).push(medicine);
  }

  getMedicines() {
    let uid = this.assistant.selectedBoss;
    return this.afd.list("medicine/" + uid).snapshotChanges()
  }

  editMedicine(medicine: Medicine) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref("medicine/" + uid + "/" + medicine.key).update({
      name: medicine.name,
      moreInfo: medicine.moreInfo,
      dosage: medicine.dosage,
      indications: medicine.indications,
      restrictions: medicine.restrictions
    })
  }

  removeMedicine(medicine: Medicine) {
    let uid = this.assistant.selectedBoss;
    this.afd.database.ref("medicine/" + uid + "/" + medicine.key).remove()
  }

}
