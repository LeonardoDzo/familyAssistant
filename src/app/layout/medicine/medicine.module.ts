import { FormsModule } from '@angular/forms';
import { MedicineComponent } from './medicine.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MedicineRoutingModule } from './medicine-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MedicineRoutingModule,
    FormsModule,
    PaginationModule.forRoot()
  ],
  declarations: [ MedicineComponent ],
  exports: [ MedicineComponent ]
})
export class MedicineModule { }
