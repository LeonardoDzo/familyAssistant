import { Boss } from './../models/boss';
import { Contacto } from '../models/contacto';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { User } from 'app/shared/models/user';
import { FirebaseApp } from 'angularfire2';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UserService {
  contacts: Observable<Contacto[]> = null;
  assistant: User = new User();
  private sub: Subscription;
  constructor(private afd: AngularFireDatabase,private afa: AngularFireAuth,public app: FirebaseApp) { 
    this.sub = this.getUserObservable().subscribe((user: User) => {
      this.assistant = user;
    }, error => {
      
    });
  }

  destroy() {
    this.sub.unsubscribe();
  }

  getContacts() {
    var uid = this.assistant.selectedBoss;
    return this.afd.list('/contacts/' + uid).valueChanges()
  }

  removeContact(contact: Contacto,toastr: ToastsManager) {
    var uid = this.assistant.selectedBoss;
    var key = contact.id;
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
    var key = contacto.id;
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

  seePending(id: string) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref(`pendings/${uid}/${id}/seen`).set(true)
  }

  finishPending(id: string) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref(`pendings/${uid}/${id}/done`).set(true)
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

  getBossesAdded() {
    var uid = this.afa.auth.currentUser.uid;
    return this.afd.database.ref(`assistants/${uid}/bosses`)
  }

  getSolicitudes() {
    var uid = this.afa.auth.currentUser.uid;
    return this.afd.list(`assistants/${uid}/solicitudes`).snapshotChanges();
  }

  private createChat(bossId: string, assistantId: string) {
    var id;
    if(bossId < assistantId)
    id = bossId + "-" + assistantId
    else
      id = assistantId + "-" + bossId
    var today = new Date().getTime()
    var members = {}
    members[bossId] = today
    members[assistantId] = today
    var group = {
      createdAt: today,
      isGroup: false,
      members: members,
      title: ""
    }
    this.afd.database.ref(`groups/${id}`).set(group)
  }

  getMessage(id: string) {
    return this.afd.database.ref(`messages/${id}`).once('value')
  }

  openChat(boss: Boss) {
    let uid = this.afa.auth.currentUser.uid
    this.afd.database.ref(`assistants/${uid}/bosses/${boss.id}`).set(new Date().getTime())
  }

  sendMessage(boss: Boss, message: string) {
    var bossId = boss.id, assistantId = this.afa.auth.currentUser.uid
    var id;
    if(bossId < assistantId)
      id = bossId + "-" + assistantId
    else
      id = assistantId + "-" + bossId
    this.afd.database.ref(`messages/`).push({
      groupId: id,
      receiver: bossId,
      remittent: assistantId,
      status: 0,
      text: message,
      timestamp: new Date().getTime(),
      type: ""
    })
  }

  acceptBoss(boss: Boss) {
    var uid = this.afa.auth.currentUser.uid;
    var bossId = boss.userKey
    this.afd.database.ref(`assistants/${uid}/bosses/${boss.userKey}`).set(new Date().getTime());
    this.afd.database.ref(`users/${boss.userKey}/assistants/${uid}`).set(true);
    this.afd.database.ref(`assistants/${uid}/solicitudes/${boss.solicitudeKey}`).remove();
    this.createChat(bossId,uid)
  }

  getMessages(boss: Boss) {
    var bossId = boss.id, assistantId = this.afa.auth.currentUser.uid
    var id;
    if(bossId < assistantId)
      id = bossId + "-" + assistantId
    else
      id = assistantId + "-" + bossId
    return this.afd.database.ref(`groups/${id}/messages`)
  }

  rejectBoss(boss: Boss) {
    let uid = this.afa.auth.currentUser.uid;
    this.afd.database.ref(`assistants/${uid}/solicitudes/${boss.userKey}`).remove();
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
