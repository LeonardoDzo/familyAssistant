import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user: any;

  constructor(public router: Router,private afa: AngularFireAuth,private afd: AngularFireDatabase) {
    this.user = this.afa.auth.currentUser;
  }

  signup(email: string, password: string,name: string,callback: (err: Error) => any) {
    this.afa
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        var list = this.afd.list('users');
        console.log(list)
        list.push({ 
          uid: user.uid,
          name: name,
          email: email,
          password: password
        });
        this.router.navigate(['/dashboard']);
      })
      .catch(callback);
  }

  login(email: string, password: string,callback: (err: Error) => any) {
    this.afa
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        this.router.navigate(['/dashboard']);
      })
      .catch(callback);
  }

  logout() {
    this.afa
      .auth
      .signOut();
  }

}
