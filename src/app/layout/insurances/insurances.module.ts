import { InsurancesComponent } from './insurances.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { InsurancesRoutingModule } from './insurances-routing.module';
import { InsurancesPanelComponent } from './insurances-panel/insurances-panel.component';

@NgModule({
  imports: [
    CommonModule,
    InsurancesRoutingModule,
    MatTabsModule
  ],
  declarations: [InsurancesComponent, InsurancesPanelComponent]
})
export class InsurancesModule { }
