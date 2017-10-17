import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class ToastService {

  constructor(public toastr: ToastsManager,vcr: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  showWarning() {
    
  }
}
