import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeboxRoutingModule } from './safebox-routing.module';
import { SafeboxComponent } from './safebox.component';
import { ImageCompressService,ResizeOptions,ImageUtilityService } from 'ng2-image-compress';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SafeboxRoutingModule,
    ToastModule,
    FormsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [ SafeboxComponent ],
  providers: [ImageCompressService,ResizeOptions]
})
export class SafeboxModule { }
