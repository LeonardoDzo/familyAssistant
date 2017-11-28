import { Subscription } from 'rxjs/Subscription';
import { User } from './../../shared/models/user';
import { Pending } from './../../shared/models/pending';
import { Boss } from './../../shared/models/boss';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService } from 'app/shared/services/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

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
    sub: Subscription;
    types = ['evento','objetivo','galeria','caja fuerte','contactos','botiquin','inmuebles','salud','seguros','presupuesto','lista de tareas','fax']
    constructor(
        private userService: UserService,
        private modalService: BsModalService
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

    ngOnInit() {
        this.userService.getSolicitudes().subscribe((bossesIds) => {
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
        })
        this.userService.getUserObservable().subscribe((user: User)=> {
            if(this.sub){
                this.sub.unsubscribe();
            }
            if(user.selectedBoss)
                this.sub = this.userService.getPendings(user.selectedBoss).subscribe((pendings: Pending[]) => {
                    this.pendings = pendings;
                });
        })
    }
}
