import { InsurancesComponent } from './insurances.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { InsurancesRoutingModule } from './insurances-routing.module';
import { InsurancesPanelComponent } from './insurances-panel/insurances-panel.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    InsurancesRoutingModule,
    MatTabsModule,
    PdfViewerModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  declarations: [InsurancesComponent, InsurancesPanelComponent]
})
export class InsurancesModule { }
