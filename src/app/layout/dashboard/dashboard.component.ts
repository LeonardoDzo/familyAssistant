import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../shared/models/user';
import { Pending } from './../../shared/models/pending';
import { Boss } from './../../shared/models/boss';
import { Event } from './../../shared/models/event';
import { Component, OnInit, TemplateRef, EventEmitter, NgZone, ElementRef, ViewChild } from '@angular/core';
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
  addHours,
  areRangesOverlapping,
  startOfMonth,
  addMonths,
  addWeeks,
  subMonths
} from 'date-fns';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';

declare var google;

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
    events: CalendarEvent[] = [];
    calendarEvents: CalendarEvent[] = [];
    refresh: Subject<any> = new Subject();
    activeDayIsOpen: boolean = false;
    view: string = 'month';
    event: Event;
    bsValue: Date = new Date();
    longitude: number = -110.970053;
    latitude: number = 29.089511;
    zoom: number = 12;
    dateModel: any;
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

    displayInfo($event,template: TemplateRef<any>) {
        this.event = $event.event.meta;
        this.modalRef = this.modalService.show(template);
    }

    public openModalEvent(template: TemplateRef<any>) {
        this.event = new Event();
        this.dateModel = {
            start: new Date(),
            end: new Date(),
            repeatEnd: new Date()
        }
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
        //this.viewDate = date;
        //this.view = "day";
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
        if(this.eventsSub){
            this.eventsSub.unsubscribe();
        }
        this.eventsSub = this.eventService.getEvents().subscribe((events) => {
            let promises = []
            this.calendarEvents = [];
            events.forEach(ev => {
                promises.push(this.eventService.getEvent(ev.key).then((event) => {
                    let eventObj: Event = event.val();
                    this.calendarEvents.push({
                        start: new Date(event.val().startdate),
                        end: new Date(event.val().enddate),
                        title: event.val().title,
                        color: this.getColor(eventObj.eventtype),
                        meta: eventObj
                    });
                    if(eventObj.repeatmodel)
                        this.repeatEvents(eventObj)
                }));
            });
            Promise.all(promises).then(() => {
                let startMonthDate = startOfMonth(subMonths(this.viewDate,1))
                let endMonthDate = endOfMonth(addMonths(this.viewDate,1))
                this.events = this.calendarEvents.filter((event) => {
                    return areRangesOverlapping(event.start,event.end,startMonthDate,endMonthDate);
                });
                this.refresh.next();
            });
        });
    }

    private getColor(type: number) {
        return (type == 0)? { primary: "#A4A4A4",secondary: "#E6E6E6" } :
               (type == 1)? { primary: "#FE2E64",secondary: "#F5A9BC" } :
               { primary: "#642EFE",secondary: "#D8CEF6" }
    }

    private repeatEvents(event: Event) {
        let endtodayrepeat = addMonths(new Date(),1).getTime()
        let repeatmodel = event.repeatmodel;
        let endrepeat = event.repeatmodel.end;
        let newevent: Event = Object.assign(new Event(),event)
        while(newevent.enddate<=endrepeat && newevent.enddate<=endtodayrepeat) {
            let newstart = (repeatmodel.interval == 1)? addDays(newevent.startdate,repeatmodel.frequency) :
                           (repeatmodel.interval == 2) ? addWeeks(newevent.startdate,repeatmodel.frequency) :
                           addMonths(newevent.startdate,repeatmodel.frequency)
            let newend = (repeatmodel.interval == 1)? addDays(newevent.enddate,repeatmodel.frequency) :
                         (repeatmodel.interval == 2) ? addWeeks(newevent.enddate,repeatmodel.frequency) :
                         addMonths(newevent.enddate,repeatmodel.frequency)
            newevent.startdate = newstart.getTime()
            newevent.enddate = newend.getTime()
            this.calendarEvents.push({
                start: new Date(newevent.startdate),
                end: new Date(newevent.enddate),
                title: newevent.title,
                color: this.getColor(newevent.eventtype),
                meta: Object.assign(new Event(),newevent)
            })
        }
    }

    viewDateChanged(date: Date) {
        let startMonthDate = startOfMonth(subMonths(this.viewDate,1))
        let endMonthDate = endOfMonth(addMonths(this.viewDate,1))
        this.events = this.calendarEvents.filter((event) => {
            return areRangesOverlapping(event.start,event.end,startMonthDate,endMonthDate);
        });
        this.refresh.next();
        this.activeDayIsOpen = false;
    }

    ngOnInit() {
        this.sub = this.userService.getUserObservable().subscribe((user: User)=> {
            this.readSolicitudes()
            this.readPendings(user)
            this.readEvents()
        });
    }
}
