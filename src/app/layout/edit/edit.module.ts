import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditRoutingModule } from './edit-routing.module';
import { EditComponent } from './edit.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
  imports: [
    CommonModule,
    EditRoutingModule,
    PageHeaderModule,
    FormsModule
  ],
  declarations: [EditComponent]
})
export class EditModule {
  construtor() { }
 }
