import { SolicitudeComponent } from './../../shared/components/solicitude/solicitude.component';
import { NotificationsComponent } from './notifications.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NotificationsRoutingModule
  ],
  declarations: [NotificationsComponent,SolicitudeComponent],
  exports: [NotificationsComponent]
})
export class NotificationsModule { }
