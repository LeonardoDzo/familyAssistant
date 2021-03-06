import { Observable } from 'rxjs/Observable';
import { User } from './../../shared/models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { FormBuilder,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserService } from 'app/shared/services/user.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  animations: [routerTransition()]
})
export class EditComponent implements OnInit {
  user = new User();
  userObs = new Observable<User>();
  private sub: Subscription;
  @ViewChild('fileInput') fileInput;
  url: string;

  constructor(public toastr: ToastsManager,vcr: ViewContainerRef,public userSvc: UserService) { 
    this.toastr.setRootViewContainerRef(vcr);
  }
  
  ngOnInit() { 
    this.userObs = this.userSvc.getUserObservable();
    this.sub = this.userObs.subscribe((user: User) => {
      this.user = user;
    }, error => {

    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.userSvc.destroy();
  }

  edit() {
    const files: FileList = this.fileInput.nativeElement.files;
    this.userSvc.update(this.user,files[0],this.toastr);
  }
}
