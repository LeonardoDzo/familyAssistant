import { InsurancesComponent } from './insurances.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { InsurancesRoutingModule } from './insurances-routing.module';
import { InsurancesPanelComponent } from './insurances-panel/insurances-panel.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InsurancesRoutingModule,
    MatTabsModule,
    PdfViewerModule,
    FormsModule
  ],
  declarations: [InsurancesComponent, InsurancesPanelComponent]
})
export class InsurancesModule { }
