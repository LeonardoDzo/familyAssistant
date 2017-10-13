import { AuthService } from './../shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormBuilder,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    public email: string
    public password: string
    public confirm: string
    public fullName: string

    constructor(public toastr: ToastsManager,public router: Router,private as: AuthService) { }

    ngOnInit() { }

    signup() {
      this.as.signup(this.email,this.password,this.fullName,err => {
        console.log('Something went wrong:',err.message);
      });
      this.toastr.error('This is not good!', 'Oops!');
    }
}
