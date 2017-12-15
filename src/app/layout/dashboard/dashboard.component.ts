import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../shared/models/user';
import { Pending } from './../../shared/models/pending';
import { Boss } from './../../shared/models/boss';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService } from 'app/shared/services/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { HttpClient } from 'selenium-webdriver/http';
import { Subject } from 'rxjs/Subject';

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
    sub: Subscription;
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    viewDate: Date = new Date();
    events = [];

    constructor(
        private userService: UserService,
        private modalService: BsModalService,
        private http: Http
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

        this.sub.unsubscribe();

        this.userService.destroy();
    }

    ngOnInit() {
        this.sub = this.userService.getUserObservable().subscribe((user: User)=> {
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
    )
    }
}
