import { AuthService } from './../shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
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

    constructor(public toastr: ToastsManager,vcr: ViewContainerRef,public router: Router,private as: AuthService) { 
      this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() { }

    signup() {
      if(this.password == this.confirm)
        this.as.signup(this.email,this.password,this.fullName,this.toastr,err => {
          return err.message
        });
      else
        this.toastr.error("Password and confirm does not match.","Error");
    }
}
