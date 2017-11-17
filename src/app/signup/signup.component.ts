import { AuthService } from './../shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit, ViewContainerRef, AfterViewInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormBuilder,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit,AfterViewInit {
    public email: string
    public password: string
    public confirm: string
    public fullName: string

    constructor(public toastr: ToastsManager,vcr: ViewContainerRef,public router: Router,private as: AuthService) { 
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

    signup() {
      if(this.password == this.confirm)
        this.as.signup(this.email,this.password,this.fullName,this.toastr,err => {
          return err.message
        });
      else
        this.toastr.error("La confirmación y la contraseña deben ser iguales...","Error");
    }
}
