import { ContactoComponent } from './contacto.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [ ContactoComponent ],
  exports: [ ContactoComponent ]
})
export class ContactoModule { }
