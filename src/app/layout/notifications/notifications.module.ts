import { MatTabsModule } from '@angular/material/tabs';
import { SolicitudeComponent } from './../../shared/components/solicitude/solicitude.component';
import { NotificationsComponent } from './notifications.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { PendingsListComponent } from './pendings-list/pendings-list.component';
import { PendingInfoModalComponent } from './pending-info-modal/pending-info-modal.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  declarations: [NotificationsComponent,SolicitudeComponent, PendingsListComponent, PendingInfoModalComponent],
  exports: [NotificationsComponent]
})
export class NotificationsModule { }
