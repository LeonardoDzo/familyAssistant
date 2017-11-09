import { FormsModule } from '@angular/forms';
import { IllnessesComponent } from './illnesses.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IllnessesRoutingModule } from './illnesses-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IllnessesRoutingModule,
    FormsModule
  ],
  declarations: [ IllnessesComponent ],
  exports: [ IllnessesComponent ]
})
export class IllnessesModule { }
