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
    user: any
    pushRightClass: string = 'push-right';
    bosses: Boss[];
    selectedBoss: Boss = new Boss();

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
        this.us.getUser().then((user: User) => {
            this.user = user;
        });

        this.us.getBosses().subscribe((bossesIds) => {
            this.bosses = [];
            let promisses = []
            bossesIds.forEach((elem) => {
                let userKey = elem.payload.toJSON().toString();
                promisses.push(this.us.getBoss(userKey).then((bossJson) => {
                    var boss = Object.assign(new Boss(),bossJson.val())
                    boss.userKey = userKey;
                    this.bosses.push(boss)
                }));
            });

            Promise.all(promisses).then(() => {
                this.us.getSelectedBoss().subscribe((bossKey: string) => {
                    if(!bossKey && this.bosses.length > 0) {
                        this.us.setSelectedBoss(this.bosses[0].userKey);
                        bossKey = this.bosses[0].userKey;
                        this.us.getBoss(bossKey).then((bossJson) => {
                            var boss = Object.assign(new Boss(),bossJson.val());
                            this.selectedBoss = boss;
                        });
                    } else {
                        this.us.getBoss(bossKey).then((bossJson) => {
                            var boss = Object.assign(new Boss(),bossJson.val());
                            this.selectedBoss = boss;
                        });
                    }
                });
            });

        });
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
        this.as.logout()
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
    }
}
