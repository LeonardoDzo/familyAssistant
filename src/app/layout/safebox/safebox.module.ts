import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeboxRoutingModule } from './safebox-routing.module';
import { SafeboxComponent } from './safebox.component';

@NgModule({
  imports: [
    CommonModule,
    SafeboxRoutingModule,
    ToastModule,
    FormsModule
  ],
  declarations: [ SafeboxComponent ]
})
export class SafeboxModule { }
