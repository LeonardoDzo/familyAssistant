import { InsurancesComponent } from './insurances.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { InsurancesRoutingModule } from './insurances-routing.module';

@NgModule({
  imports: [
    CommonModule,
    InsurancesRoutingModule,
    MatTabsModule
  ],
  declarations: [InsurancesComponent]
})
export class InsurancesModule { }
