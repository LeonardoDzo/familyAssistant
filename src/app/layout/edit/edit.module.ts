import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoutingModule } from './edit-routing.module';
import { EditComponent } from './edit.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
  imports: [
    CommonModule,
    EditRoutingModule,
    PageHeaderModule
  ],
  declarations: [EditComponent]
})
export class EditModule {
  construtor() {
    console.log("entró alv")
  }
 }
