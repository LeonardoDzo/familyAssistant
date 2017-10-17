import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,public af: AngularFireAuth) { }

    canActivate() {
        return new Promise<boolean>((resolve, reject) => {
            this.af.auth.onAuthStateChanged((user) => {
                if(!user){
                    this.router.navigate(['/login']);
                }
                resolve(user != null)
            });
        })
    }
}
