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
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-4/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export const firebase = {
    apiKey: "AIzaSyBLaihGHRC-MTKOs8prjsumm6kIC4njYsg",
    authDomain: "proyecto-prueba-c4943.firebaseapp.com",
    databaseURL: "https://proyecto-prueba-c4943.firebaseio.com",
    projectId: "proyecto-prueba-c4943",
    storageBucket: "proyecto-prueba-c4943.appspot.com",
    messagingSenderId: "661241647332"
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
        ToastModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        })
    ],
    providers: [AuthGuard,AuthService],
    bootstrap: [AppComponent]
})

export class AppModule {
}
