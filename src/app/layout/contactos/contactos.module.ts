import { CustomPaginator } from './../../custom-paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ContactoModule } from './../../shared/components/contacto/contacto.module';
import { ContactoComponent } from './../../shared/components/contacto/contacto.component';
import { PageHeaderComponent } from './../../shared/modules/page-header/page-header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactosRoutingModule } from './contactos-routing.module';
import { ContactosComponent } from './contactos.component';
import { PageHeaderModule } from './../../shared';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TableContactsComponent } from './table-contacts/table-contacts.component';
import { NewContactModalComponent } from './new-contact-modal/new-contact-modal.component';
import { MatPaginatorIntl } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    ContactosRoutingModule,
    PageHeaderModule,
    FormsModule,
    ContactoModule,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    MatInputModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  declarations: [
    ContactosComponent,
    TableContactsComponent,
    NewContactModalComponent
  ],
  providers: [{provide: MatPaginatorIntl, useClass: CustomPaginator}]
  
})

export class ContactosModule { }
