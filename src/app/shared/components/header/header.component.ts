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
export class HeaderComponent implements AfterViewInit {
    name: any
    pushRightClass: string = 'push-right';
    
    constructor(
        private translate: TranslateService, 
        public router: Router,
        private as: AuthService,
        private us: UserService
    ) {
        us.getUser().then((user: User) => {
            this.name = user.name
        })
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
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

    isToggled(): boolean {
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
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
