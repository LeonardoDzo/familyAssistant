import { User } from 'app/shared/models/user';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import {} from '@types/googlemaps';
import { UserService } from 'app/shared/services/user.service';

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
  usersToInvite = [];
  selectedBoss: string;
  selectedUsers: string[];
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private userService: UserService
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

  cale() {
    console.log(this.selectedUsers);
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
}
