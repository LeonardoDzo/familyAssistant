import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from './../shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit, ViewContainerRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormBuilder,FormGroup } from '@angular/forms';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit,AfterViewInit {
    public email: string;
    public password: string;

    constructor(public toastr: ToastsManager,vcr: ViewContainerRef,public as: AuthService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() { }

    ngAfterViewInit() {
        $('input.input-material').on('focus', function () {
            $(this).siblings('.label-material').addClass('active');
        });
    
        $('input.input-material').on('blur', function () {
            $(this).siblings('.label-material').removeClass('active');
          
            if ($(this).val() !== '') {
                $(this).siblings('.label-material').addClass('active');
            } else {
                $(this).siblings('.label-material').removeClass('active');
            }
        });
    }

    login() {
        this.as.login(this.email,this.password,this.toastr,(err: Error) => {
            return err.message;
        });
    }
}
