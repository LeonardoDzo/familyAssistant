import { ContactoModule } from './../../shared/components/contacto/contacto.module';
import { ContactoComponent } from './../../shared/components/contacto/contacto.component';
import { PageHeaderComponent } from './../../shared/modules/page-header/page-header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactosRoutingModule } from './contactos-routing.module';
import { ContactosComponent } from './contactos.component';
import { PageHeaderModule } from './../../shared';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    CommonModule,
    ContactosRoutingModule,
    PageHeaderModule,
    FormsModule,
    ContactoModule,
    TabsModule.forRoot()
  ],
  declarations: [ContactosComponent]
})
export class ContactosModule { }
