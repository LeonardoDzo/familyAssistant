import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { FormsModule } from '@angular/forms'

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    AngularFireAuthModule,
    FormsModule
  ],
  declarations: [SignupComponent]
})
export class SignupModule { }
