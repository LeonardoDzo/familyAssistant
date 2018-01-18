import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NgbCarouselModule,
    NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
import { StatModule } from '../../shared';
import { CalendarModule } from 'angular-calendar';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { NewEventModalComponent } from './new-event-modal/new-event-modal.component';
import { EventInfoModalComponent } from './event-info-modal/event-info-modal.component';
import {SelectModule} from 'ng2-select';
import {MatSelectModule, MatSelect} from '@angular/material/select';
@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DashboardRoutingModule,
        StatModule,
        CalendarModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        TimepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCXGhKTVOXYJesrwqmLewB-e-Qa20Nqtvo',
            libraries: ["places"]
        }),
        SelectModule,
        MatSelectModule
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent,
        NewEventModalComponent,
        EventInfoModalComponent
    ]
})
export class DashboardModule { }
