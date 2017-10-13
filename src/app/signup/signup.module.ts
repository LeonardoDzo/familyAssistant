import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { FormsModule } from '@angular/forms';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {ToastOptions} from 'ng2-toastr';

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    AngularFireAuthModule,
    FormsModule,
    ToastModule.forRoot()
  ],
  declarations: [SignupComponent]
})
export class SignupModule { }
