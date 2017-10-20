import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { User } from 'app/shared/services/user';
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class UserService {
  
  constructor(private afd: AngularFireDatabase,private afa: AngularFireAuth,public app: FirebaseApp) { }

  getUserObservable(): Observable<any> {
    var uid = this.afa.auth.currentUser.uid
    return this.afd.object(`/users/${uid}`).valueChanges()
  }

  getUser() {
    var uid = this.afa.auth.currentUser.uid
    return new Promise<User>((resolve, reject) => {
      this.afd.database.ref(`/users/${uid}`).once('value').then(u => {
        var user = new User();
        user = u.val();
        resolve(user);
      });
    });
  }

  private getExt(name: string): string {
    return name.split('.').pop();
  }

  private upload(file: File,toastr: ToastsManager,uid:string) {
    var ref = this.app.storage().ref()
    var ext = this.getExt(file.name)
    var imageRef = ref.child('images/' + uid + "." + ext)
    imageRef.put(file).then((snapshot) => {
      this.afd.database.ref(`/users/${uid}`).update({
        url: snapshot.downloadURL
      })
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
    this.afd.database.ref(`/users/${uid}`).update({
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
