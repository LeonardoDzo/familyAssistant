import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  constructor(public router: Router,private afa: AngularFireAuth,private afd: AngularFireDatabase) { 

  }

  signup(email: string, password: string,name: string,toastr: ToastsManager,callback: (err: Error) => string) {
    this.afa
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
       console.log(user) 
       this.afd.database.ref('assistants/' + user.uid).set({
          name: name,
          email: email,
          rfc: '',
          curp: '',
          bloodtype: '',
          phone: '',
          nss: '',
          password: password,
          id: user.uid
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
      .signOut().then(() => {
        this.router.navigate(['/login']);
      })
  }
}
