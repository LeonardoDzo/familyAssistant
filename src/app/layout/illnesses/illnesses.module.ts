import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IllnessesComponent } from './illnesses.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { IllnessesRoutingModule } from './illnesses-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import { IllnessesTableComponent } from './illnesses-table/illnesses-table.component';
import { NewIllnessModalComponent } from './new-illness-modal/new-illness-modal.component';

@NgModule({
  imports: [
    CommonModule,
    IllnessesRoutingModule,
    FormsModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    ReactiveFormsModule
  ],
  declarations: [ IllnessesComponent, IllnessesTableComponent, NewIllnessModalComponent ],
  exports: [ IllnessesComponent ]
})
export class IllnessesModule { }
