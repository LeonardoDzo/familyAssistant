import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  constructor(public router: Router,private afa: AngularFireAuth,private afd: AngularFireDatabase) { }

  signup(email: string, password: string,name: string,toastr: ToastsManager,callback: (err: Error) => string) {
    this.afa
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
       this.afd.database.ref('users/' + user.uid).set({
          name: name,
          email: email,
          password: password,
          rfc: '',
          curp: '',
          tipoSangre: '',
          telefono: '',
          nss: ''
        });
        this.router.navigate(['/dashboard']);
      })
      .catch((err: Error) => {
        var message = callback(err)
        toastr.error(message, 'Error')
      });
  }

  login(email: string, password: string,toastr: ToastsManager,callback: (err: Error) => string) {
    this.afa
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        this.router.navigate(['/dashboard']);
      })
      .catch((err: Error) => {
        var message = callback(err)
        toastr.error(message,'Error')
      });
  }

  logout() {
    this.afa
      .auth
      .signOut()
      .then(() => {
        localStorage.clear();
      })
      .catch();
  }

  getName() {
    var uid = this.afa.auth.currentUser.uid
    return new Promise<string>((resolve, reject) => {
      this.afd.database.ref(`/users/${uid}`).once('value').then((snapshot: DatabaseSnapshot) => {
        resolve(snapshot.val().name)
      });
    })
  }
}
