import { InsurancesService } from './../shared/services/insurances.service';
import { TodoService } from './../shared/services/todo.service';
import { FilesService } from './../shared/services/files.service';
import { RegexService } from './../shared/services/regex.service';
import { UserService } from './../shared/services/user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent, SidebarComponent } from '../shared';
import { ModalModule } from 'ngx-bootstrap';
import { CrudService } from 'app/shared/services/crud.service';
import { EventService } from 'app/shared/services/event.service';
import { CalendarModule } from 'angular-calendar';
import { ChatsetComponent } from './chatset/chatset.component';
import { ChatComponent } from './chatset/chat/chat.component';
import { ListComponent } from './chatset/list/list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        NgbDropdownModule.forRoot(),
        LayoutRoutingModule,
        TranslateModule,
        ModalModule.forRoot(),
        FormsModule
    ],
    declarations: [
        LayoutComponent,
        HeaderComponent,
        SidebarComponent,
        ChatsetComponent,
        ChatComponent,
        ListComponent
    ],
    providers: [
        UserService,
        RegexService,
        FilesService,
        TodoService,
        CrudService,
        EventService,
        InsurancesService
    ]
})
export class LayoutModule { }
