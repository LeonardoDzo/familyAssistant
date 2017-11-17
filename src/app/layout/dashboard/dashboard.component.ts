import { Boss } from './../../shared/models/boss';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService } from 'app/shared/services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    bosses: Boss[];

    constructor(
        private userService: UserService
    ) {
        
    }

    ngOnInit() {
        this.userService.getSolicitudes().subscribe((bossesIds) => {
            this.bosses = [];
            bossesIds.forEach((elem) => {
                let userKey = elem.payload.toJSON().toString()
                let solicitudeKey = elem.key;
                this.userService.getBoss(userKey).then((bossJson) => {
                    var boss = Object.assign(new Boss(),bossJson.val())
                    boss.userKey = userKey;
                    boss.solicitudeKey = solicitudeKey;
                    this.bosses.push(boss)
                });
            })
        })
    }
}
