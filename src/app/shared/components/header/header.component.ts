import { Subscription } from 'rxjs/Subscription';
import { Boss } from './../../models/boss';
import { UserService } from 'app/shared/services/user.service';
import { User } from 'app/shared/models/user';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from 'angularfire2/auth';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,AfterViewInit {
    user: any = new User();
    pushRightClass: string = 'push-right';
    bosses: Boss[];
    selectedBoss: Boss = new Boss();
    bossesSub: Subscription
    pendingsSub: Subscription
    userSub: Subscription
    unseen: number = 0
    solicitudes: number = 0
    constructor(
        private translate: TranslateService, 
        public router: Router,
        private as: AuthService,
        private us: UserService
    ) {

        /*this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });*/
    }

    ngOnInit() {
        this.userSub = this.us.getUserObservable().subscribe((user: User) => {
            this.user = user;
            if(this.pendingsSub) {
                this.pendingsSub.unsubscribe()
            }
            this.pendingsSub = this.us.getUnseenPendings(user.selectedBoss).subscribe((pendings => {
                this.unseen = pendings.length
            }))
            if(this.bossesSub) {
                this.bossesSub.unsubscribe()
            }
            this.bossesSub = this.us.getSolicitudes().subscribe(bosses => {
                this.solicitudes = bosses.length
            })
        });
    }

    ngOnDestroy(){        
        this.userSub.unsubscribe();
        if(this.bossesSub) {
            this.bossesSub.unsubscribe()
        }
        if(this.pendingsSub) {
            this.pendingsSub.unsubscribe()
        }
        this.us.destroy();
    }

    ngAfterViewInit() { 
        $('#search').on('click', function (e) {
            e.preventDefault();
            $('.search-box').fadeIn();
        });
        $('.dismiss').on('click', function () {
            $('.search-box').fadeOut();
        });
    }

    logout() {
        this.as.logout();
    }

    /*isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }*/

    changeLang(language: string) {
        this.translate.use(language);
    }

    changeSelectedBoss(boss: Boss) {
        this.us.setSelectedBoss(boss.userKey)
        this.selectedBoss = this.bosses.find(b => {
            if(boss.userKey == b.userKey){
                return true
            }
            return false
        });
    }
}
