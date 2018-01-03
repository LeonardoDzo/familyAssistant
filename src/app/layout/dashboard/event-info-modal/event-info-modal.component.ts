import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'app/shared/models/event';

@Component({
  selector: 'app-event-info-modal',
  templateUrl: './event-info-modal.component.html',
  styleUrls: ['./event-info-modal.component.scss']
})
export class EventInfoModalComponent implements OnInit {
  @Input()
  event: Event;
  startdate: Date;
  enddate: Date;
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  constructor() { 

  }
  getDateString(date: Date) {
    return date.getDay() + " de " + this.monthNames[date.getMonth()] + " de " + date.getFullYear() + " a las " + date.getHours() + ":" + date.getMinutes()
  }
  ngOnInit() {
    this.startdate = new Date(this.event.startdate)
    this.enddate = new Date(this.event.enddate)
    console.log(this.event.location)
  }

}
