import { ContactModalModule } from './../../shared/components/contact-modal/contact-modal.module';
import { PageHeaderComponent } from './../../shared/modules/page-header/page-header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactosRoutingModule } from './contactos-routing.module';
import { ContactosComponent } from './contactos.component';
import { PageHeaderModule } from './../../shared';
import { ContactoModule } from 'app/shared/components/contacto/contacto.module';

@NgModule({
  imports: [
    CommonModule,
    ContactosRoutingModule,
    PageHeaderModule,
    ContactoModule,
    FormsModule,
    ContactModalModule
  ],
  declarations: [ContactosComponent]
})
export class ContactosModule { }
