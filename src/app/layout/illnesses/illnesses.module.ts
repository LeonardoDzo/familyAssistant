import { FormsModule } from '@angular/forms';
import { IllnessesComponent } from './illnesses.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { IllnessesRoutingModule } from './illnesses-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    IllnessesRoutingModule,
    FormsModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  declarations: [ IllnessesComponent ],
  exports: [ IllnessesComponent ]
})
export class IllnessesModule { }
