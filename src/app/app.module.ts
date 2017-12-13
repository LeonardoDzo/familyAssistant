import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard,AuthService } from './shared';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {ToastOptions} from 'ng2-toastr';
import {BsDropdownModule} from 'ngx-bootstrap';
import {HttpClientModule} from '@angular/common/http';

import 'firebase/storage';
import 'firebase/database';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-4/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export class CustomOption extends ToastOptions {
    positionClass = "toast-bottom-right";
  }

export const firebase = {
    apiKey: "AIzaSyBEXLwmv3x2QR8cpnXXf2w55C30397dH1A",
    authDomain: "familyoffice-63b4b.firebaseapp.com",
    databaseURL: "https://familyoffice-63b4b.firebaseio.com",
    projectId: "familyoffice-63b4b",
    storageBucket: "familyoffice-63b4b.appspot.com",
    messagingSenderId: "659477423500"
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        AngularFireModule.initializeApp(firebase),
        AngularFireModule,
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        ToastModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        })
    ],
    providers: [
        AuthGuard,
        AuthService,
        {provide: ToastOptions, useClass: CustomOption},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
