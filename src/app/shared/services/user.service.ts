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
  constructor(private afd: AngularFireDatabase,private afa: AngularFireAuth,public app: FirebaseApp) { }

  getContacts(): Observable<Contacto[]> {
    var uid = this.afa.auth.currentUser.uid;
    this.contacts = this.afd.list('/contacts/' + uid).valueChanges()
    return this.contacts;
  }

  removeContact(contact: Contacto,toastr: ToastsManager) {
    var uid = this.afa.auth.currentUser.uid;
    var key = contact.key;
    this.afd.database.ref('contacts/' + uid + '/' + key).remove().then(() => {
      toastr.error("El usuario ha sido eliminado...",null);
    });
  }

  addContact(contacto: Contacto,toastr: ToastsManager) {
    var uid = this.afa.auth.currentUser.uid;
    let key = this.afd.database.ref('contacts/' + uid).push({
      nombre: contacto.nombre,
      telefono: contacto.telefono,
      ocupacion: contacto.ocupacion,
      direccion: contacto.direccion,
      url: contacto.url
    }).then((contacto) => {
      this.afd.database.ref('contacts/' + uid + "/" + contacto.key).update({
        key: contacto.key
      })
    });
  }

  updateContact(contacto: Contacto,toastr: ToastsManager) {
    var uid = this.afa.auth.currentUser.uid;
    var key = contacto.key;
    this.afd.database.ref('contacts/' + uid + '/' + key).update(contacto).then(() => {
      toastr.success("Los datos se han guardado correctamente.",null);
    });
  }

  getUserObservable(): Observable<any> {
    var uid = this.afa.auth.currentUser.uid
    return this.afd.object(`/assistants/${uid}`).valueChanges()
  }

  getBoss(uid: string) {
    return this.afd.database.ref(`users/${uid}`).once('value');
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
    var imageRef = ref.child('images/' + uid + "." + ext)
    imageRef.put(file).then((snapshot) => {
      this.afd.database.ref(`/assistants/${uid}`).update({
        url: snapshot.downloadURL
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
      tipoSangre: user.tipoSangre,
      telefono: user.telefono,
      nss: user.nss
    }).then(() => {
      toastr.success("Se guardaron los datos correctamente.","Confirmación:")
    }).catch(() => {
      toastr.error("Hubo un problema actualizando los datos...","Error:")
    })
  }
}
