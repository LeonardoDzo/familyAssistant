import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../shared/models/user';
import { Pending } from './../../shared/models/pending';
import { Boss } from './../../shared/models/boss';
import { Event } from './../../shared/models/event';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService } from 'app/shared/services/user.service';
import { EventService } from 'app/shared/services/event.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { HttpClient } from 'selenium-webdriver/http';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    bosses: Boss[];
    pendings: Pending[];
    pending: Pending = new Pending();
    public modalRef: BsModalRef;
    pendingsSub: Subscription;
    solicitudesSub: Subscription;
    types = ['evento','objetivo','galeria','caja fuerte','contactos','botiquin','inmuebles','salud','seguros','presupuesto','lista de tareas','fax']
    monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    sub: Subscription;
    eventsSub: Subscription;
    viewDate: Date = new Date();
    events: Event[] = [];
    calendarEvents: CalendarEvent[] = [];
    refresh: Subject<any> = new Subject();
    activeDayIsOpen: boolean = false;
    view: string = 'month';
    actions: CalendarEventAction[] = [
        {
          label: '<i class="fa fa-fw fa-pencil"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
              console.log(event)
          }
        },
        {
          label: '<i class="fa fa-fw fa-times"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
              console.log(event)
          }
        }
    ];

    constructor(
        private userService: UserService,
        private modalService: BsModalService,
        private http: Http,
        private eventService: EventService
    ) {
        
    }

    public openModal(template: TemplateRef<any>,pending: Pending) {
        this.pending = Object.assign(new Pending(),pending);
        this.modalRef = this.modalService.show(template);
    }
    
    getLabel(pending: Pending) {
        return (pending.priority == 0) ? 'green-label' : (pending.priority == 1) ?
            'yellow-label' : 'red-label';
    }

    getType(type: number) {
        return this.types[type];
    }

    ngOnDestroy(){
        if(this.pendingsSub){
            this.pendingsSub.unsubscribe();
        }

        if(this.solicitudesSub){
            this.solicitudesSub.unsubscribe();
        }

        if(this.eventsSub){
            this.eventsSub.unsubscribe();
        }

        this.sub.unsubscribe();

        this.userService.destroy();
    }

    private readSolicitudes() {
        if(this.solicitudesSub){
            this.solicitudesSub.unsubscribe();
        }
        this.solicitudesSub = this.userService.getSolicitudes().subscribe((bossesIds) => {
            this.bosses = [];
            bossesIds.forEach((elem) => {
                let userKey = elem.payload.toJSON().toString();
                let solicitudeKey = elem.key;
                this.userService.getBoss(userKey).then((bossJson) => {
                    var boss = Object.assign(new Boss(),bossJson.val())
                    boss.userKey = userKey;
                    boss.solicitudeKey = solicitudeKey;
                    this.bosses.push(boss)
                });
            })
        }, error => {

        })
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    private readPendings(user: User) {
        if(this.pendingsSub){
            this.pendingsSub.unsubscribe();
        }
        if(user.selectedBoss){
            this.pendingsSub = this.pendingsSub = this.userService.getPendings(user.selectedBoss)
            .subscribe((pendings: Pending[]) => {
                this.pendings = pendings;
            }, error => {

            });
        }
    }

    private readEvents() {
        this.calendarEvents = [];
        if(this.eventsSub){
            this.eventsSub.unsubscribe();
        }
        this.eventsSub = this.eventService.getEvents().subscribe((events) => {
            let promises = []
            events.forEach(ev => {
                promises.push(this.eventService.getEvent(ev.key).then((event) => {
                    let eventObj: Event = event.val();
                    this.calendarEvents.push({
                        start: new Date(event.val().startdate),
                        end: new Date(event.val().enddate),
                        title: event.val().title,
                        color: { primary: '#08088A', secondary: '#E0E0F8'},
                        actions: this.actions,
                        meta: eventObj
                    });
                }));
            });
            Promise.all(promises).then(() => {
                console.log(this.calendarEvents)
                this.refresh.next();
            });
        });
    }

    ngOnInit() {
        this.sub = this.userService.getUserObservable().subscribe((user: User)=> {
            this.readSolicitudes()
            this.readPendings(user)
            this.readEvents()
        })
    }
}
