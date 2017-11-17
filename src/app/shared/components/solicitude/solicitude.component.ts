import { Boss } from './../../models/boss';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-solicitude',
  templateUrl: './solicitude.component.html',
  styleUrls: ['./solicitude.component.scss']
})
export class SolicitudeComponent implements OnInit {
  @Input() boss: Boss;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  acceptBoss() {
    this.userService.acceptBoss(this.boss)
  }

  rejectBoss() {
    this.userService.rejectBoss(this.boss)
  }
}
