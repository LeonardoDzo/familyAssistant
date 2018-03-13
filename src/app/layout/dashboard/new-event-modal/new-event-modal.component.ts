import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { EventService } from 'app/shared/services/event.service';
import { User } from 'app/shared/models/user';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import {} from '@types/googlemaps';
import { UserService } from 'app/shared/services/user.service';
import { Event } from 'app/shared/models/event';
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

@Component({
  selector: 'app-new-event-modal',
  templateUrl: './new-event-modal.component.html',
  styleUrls: ['./new-event-modal.component.scss']
})
export class NewEventModalComponent implements OnInit {
  @ViewChild("search")
  searchElementRef: ElementRef;
  allDay: boolean = true;
  @Input()
  public modalRef: BsModalRef;
  @Input()
  dateModel: any;
  hasLocation: boolean = false;
  @Input()
  latitude: number;
  @Input()
  longitude: number;
  @Input()
  zoom: number;
  @Input()
  event: Event;
  repeat: boolean = false;
  public searchControl: FormControl;
  interval: number
  frequency: number
  usersToInvite = [];
  selectedBoss: string;
  selectedUsers: string[];
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private userService: UserService,
    private eventService: EventService
  ) { }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 17;
      });
    }
  }

  mapClick($event) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
  }

  private getUsers(familyId: string) {
    this.userService.getFamily(familyId).then((family) => {
      let bossesIds = Object.keys(family.val().members)
      bossesIds.forEach(id => {
        if(id != this.selectedBoss)
          this.userService.getBoss(id).then(boss => {
            if(this.usersToInvite.find(val => {
              return val.id == id
            }) == undefined)
              this.usersToInvite.push(boss.val())
          });
      });
    });
  }

  initInviteUsers() {
    let familiesIds;
    this.userService.getUser().then((user: User) => {
      this.userService.getBoss(user.selectedBoss).then(boss => {
        this.selectedBoss = user.selectedBoss;
        this.usersToInvite = []
        familiesIds = Object.keys(boss.val().families);
      }).then(() => {
        familiesIds.forEach(id => {
          this.getUsers(id); 
        });
      })
    })
  }

  submit() {
    if(this.hasLocation) {
      this.event.location = {
        latitude: this.latitude,
        longitude: this.longitude,
        title: "",
        subtitle: ""
      }
    }
    if(this.repeat) {
      this.event.repeatmodel = {
        interval: Number(this.interval),
        frequency: this.frequency,
        end: this.dateModel.repeatEnd.getTime()
      }
    } else {
      this.event.repeatmodel = {
        interval: 0,
        frequency: 0,
        end: 0
      }
    }
    if(this.allDay) {
      this.dateModel.start = startOfDay(this.dateModel.start)
      this.dateModel.end = endOfDay(this.dateModel.end)
    }

    this.event.startdate = this.dateModel.start.getTime()
    this.event.enddate = this.dateModel.end.getTime()
    this.event.members = {}
    this.event.members[this.selectedBoss] = {
      id: this.selectedBoss,
      reminder: -1,
      status: 0
    }
    if(this.selectedUsers)
      this.selectedUsers.forEach((key) => {
        this.event.members[key] = {
          id: key,
          reminder: -1,
          status: 0
        }
      })
    this.event.admins = {}
    this.event.admins[this.selectedBoss] = true
    this.event.eventtype = Number(this.event.eventtype)
    this.eventService.addEvent(this.event)
    this.modalRef.hide()
  }

  changeStart($event) {
    this.dateModel.end = new Date(this.dateModel.start.getTime())
  }

  ngOnInit() {
    this.initInviteUsers();
    //create search FormControl
    this.searchControl = new FormControl();
    
    this.setCurrentPosition()

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {  
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 17;
        });
      });
    });
  }

  ngOnDestroy() {
    this.userService.destroy()
    this.eventService.destroy()
  }
}
