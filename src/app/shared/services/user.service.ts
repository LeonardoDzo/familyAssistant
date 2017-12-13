import { Boss } from './../models/boss';
import { Contacto } from '../models/contacto';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { User } from 'app/shared/models/user';
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class UserService {
  contacts: Observable<Contacto[]> = null;
  assistant: User = new User();
  
  constructor(private afd: AngularFireDatabase,private afa: AngularFireAuth,public app: FirebaseApp) { 
    this.getUserObservable().subscribe((user: User) => {
      this.assistant = user;
    });
  }

  getContacts() {
    var uid = this.assistant.selectedBoss;
    return this.afd.list('/contacts/' + uid).valueChanges()
  }

  removeContact(contact: Contacto,toastr: ToastsManager) {
    var uid = this.assistant.selectedBoss;
    var key = contact.key;
    this.afd.database.ref('contacts/' + uid + '/' + key).remove().then(() => {
      toastr.error("El usuario ha sido eliminado...",null);
    });
  }

  addContact(contacto: Contacto,toastr: ToastsManager) {
    var uid = this.assistant.selectedBoss;
    let key = this.afd.database.ref('contacts/' + this.assistant.selectedBoss).push({
      name: contacto.name,
      phone: contacto.phone,
      job: contacto.address,
      address: contacto.address,
      webpage: contacto.webpage,
      email: contacto.email
    });
  }

  updateContact(contacto: Contacto,toastr: ToastsManager) {
    var uid = this.assistant.selectedBoss;
    var key = contacto.key;
    this.afd.database.ref('contacts/' + uid + '/' + key).update(contacto).then(() => {
      toastr.success("Los datos se han guardado correctamente.",null);
    });
  }

  getFamily(key: string) {
    return this.afd.database.ref(`families/${key}`).once('value')
  }

  getUserObservable(): Observable<any> {
    var uid = this.afa.auth.currentUser.uid
    return this.afd.object(`/assistants/${uid}`).valueChanges()
  }

  getBoss(uid: string)  {
    return this.afd.database.ref(`users/${uid}`).once('value');
  }

  getPendings(bossKey: string) {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.list(`pendings/${uid}`, ref => ref.orderByChild('boss').equalTo(bossKey)).valueChanges();
  }

  getUser() {
    var uid = this.afa.auth.currentUser.uid
    return new Promise<User>((resolve, reject) => {
      this.afd.database.ref(`/assistants/${uid}`).once('value').then(u => {
        var user = new User();
        user = u.val();
        resolve(user);
      });
    });
  }

  getSelectedBoss() {
    var uid = this.afa.auth.currentUser.uid;
    return this.afd.object(`/assistants/${uid}/selectedBoss`).valueChanges();
  }

  setSelectedBoss(key: string) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref(`assistants/${uid}`).update({
      selectedBoss: key
    });
  }

  setFamilyActive(key: string) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref(`assistants/${uid}`).update({
      familyActive: key
    });
  }

  getBosses() {
    var uid = this.afa.auth.currentUser.uid;
    return this.afd.list(`assistants/${uid}/bosses`).snapshotChanges();
  }

  getSolicitudes() {
    var uid = this.afa.auth.currentUser.uid;
    return this.afd.list(`assistants/${uid}/solicitudes`).snapshotChanges();
  }

  acceptBoss(boss: Boss) {
    var uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref(`assistants/${uid}/bosses`).push(boss.userKey);
    this.afd.database.ref(`users/${boss.userKey}/assistants`).push(uid);
    this.afd.database.ref(`assistants/${uid}/solicitudes/${boss.solicitudeKey}`).remove();
  }

  rejectBoss(boss: Boss) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref(`assistants/${uid}/solicitudes/${boss.solicitudeKey}`).remove();
  }

  private getExt(name: string): string {
    return name.split('.').pop();
  }

  private upload(file: File,toastr: ToastsManager,uid:string) {
    var ref = this.app.storage().ref()
    var ext = this.getExt(file.name)
    var imageRef = ref.child(`assistants/${uid}/` + uid + "." + ext)
    imageRef.put(file).then((snapshot) => {
      this.afd.database.ref(`/assistants/${uid}`).update({
        photoURL: snapshot.downloadURL
      });
      toastr.success("La imagen fue actualizada correctamente.","Confirmación:")
    }).catch((err) => {
      toastr.error("Sucedió un error subiendo la imagen...","Error:")
    })
  }

  update(user: User,file: File,toastr: ToastsManager) {
    var uid = this.afa.auth.currentUser.uid;
    if(file) {
      this.upload(file,toastr,uid)
    }
    this.afd.database.ref(`/assistants/${uid}`).update({
      rfc: user.rfc,
      curp: user.curp,
      bloodtype: user.bloodtype,
      phone: user.phone,
      nss: user.nss
    }).then(() => {
      toastr.success("Se guardaron los datos correctamente.","Confirmación:")
    }).catch(() => {
      toastr.error("Hubo un problema actualizando los datos...","Error:")
    })
  }
}
