import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,public af: AngularFireAuth,private db: AngularFireDatabase) { }

    canActivate() {
        return new Promise<boolean>((resolve, reject) => {
            this.af.auth.onAuthStateChanged((user) => {
                if(!user){
                    this.router.navigate(['/login']);
                }
                this.db.database.ref('assistants').once('value').then((snapshot) => {
                    resolve(user != null && snapshot.hasChild(`${user.uid}`))
                })
            });
        })
    }
}
