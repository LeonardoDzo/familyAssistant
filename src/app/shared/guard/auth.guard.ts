import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,public af: AngularFireAuth) { }

    canActivate() {
        if (this.af.auth.currentUser) {
            console.log(this.af.auth.currentUser)
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
