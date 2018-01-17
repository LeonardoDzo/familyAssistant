import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { User } from 'app/shared/models/user';
import { Boss } from './../../models/boss';
import { Family } from './../../models/family';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Subscription } from 'rxjs/Subscription';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive = false;
    showMenu = '';
    bosses: Boss[];
    user: User = new User();
    selectedBoss: Boss = new Boss();
    familyActive: Family;
    families: Family[];
    modalRef: BsModalRef;
    userSub: Subscription;
    bossesSub: Subscription;
    constructor(
        private us: UserService,
        private modalService: BsModalService
    ) { }

    openModal(template: TemplateRef<any>) {
        if(this.families.length > 1)
            this.modalRef = this.modalService.show(template);
    }

    initFam() {
        let famKeys: string[] = Object.keys(this.selectedBoss.families)

        this.families = [];
        let promises = []
        famKeys.forEach((key) => {
            promises.push(this.us.getFamily(key).then((family) => {
                this.families.push(Object.assign(new Family(),family.val()))
            }));
        })
        Promise.all(promises).then(() => {
            if(this.families.length >= 1) {
                this.familyActive = this.families[0];
                this.us.setFamilyActive(this.families[0].id);
            }
        })
    }

    ngOnDestroy(){
        this.userSub.unsubscribe();
        this.bossesSub.unsubscribe();
    }

    ngOnInit() {
        this.userSub = this.us.getUserObservable().subscribe((user: User) => {
            this.user = user;
        },error => {
            
        });

        this.bossesSub = this.us.getBosses().subscribe((bossesIds) => {
            this.bosses = [];
            let promisses = [];
            bossesIds.forEach((elem) => {
                let userKey = elem.key;
                promisses.push(this.us.getBoss(userKey).then((bossJson) => {
                    var boss = Object.assign(new Boss(),bossJson.val())
                    boss.userKey = userKey;
                    this.bosses.push(boss)
                }));
            });
            
            Promise.all(promisses).then(() => {
                if(this.user.selectedBoss) {
                    this.selectedBoss = this.bosses.find(b => {
                        if(this.user.selectedBoss == b.userKey){
                            return true
                        }
                        return false
                    })
                } else if(this.bosses.length > 0){
                    this.selectedBoss = this.bosses[0];
                    this.us.setSelectedBoss(this.bosses[0].id);
                }
                if(this.user.selectedBoss)
                    this.initFam()
            });
        }, error => {

        });
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    changeSelectedBoss(boss: Boss) {
        this.us.setSelectedBoss(boss.userKey)
        this.selectedBoss = this.bosses.find(b => {
            if(boss.userKey == b.userKey){
                return true
            }
            return false
        });
        this.initFam();
    }

    changeFamily(family: Family) {
        this.us.setFamilyActive(family.id);
        this.familyActive = family;
        this.modalRef.hide();
    }
}
