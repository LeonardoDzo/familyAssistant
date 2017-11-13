import { Medicine } from '../models/medicine';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';

@Injectable()
export class MedicineService {

  constructor(
    private afd: AngularFireDatabase,
    private afa: AngularFireAuth
  ) { }

  addMedicine(medicine: Medicine) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref("medicine/" + uid).push(medicine);
  }

  getMedicines() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.list("medicine/" + uid).snapshotChanges()
  }

  editMedicine(medicine: Medicine) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref("medicine/" + uid + "/" + medicine.key).update({
      name: medicine.name,
      moreInfo: medicine.moreInfo,
      dosage: medicine.dosage,
      indications: medicine.indications,
      restrictions: medicine.restrictions
    })
  }

  removeMedicine(medicine: Medicine) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref("medicine/" + uid + "/" + medicine.key).remove()
  }

}
