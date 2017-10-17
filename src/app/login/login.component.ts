import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from './../shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormBuilder,FormGroup } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    public email: string;
    public password: string;

    constructor(public toastr: ToastsManager,vcr: ViewContainerRef,public as: AuthService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() { }

    login() {
        this.as.login(this.email,this.password,this.toastr,(err: Error) => {
            return err.message;
        });
    }
}
