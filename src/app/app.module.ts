import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule, MatGridListModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { NotificationService } from './notification.service';

import {LoginService} from './login/login.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DemoUtilsModule } from '../demo-utils/module';
import { CalendarComponent } from './calendar/calendar.component';

export const firebaseConfig = {
  apiKey: "AIzaSyARJaQ6IU3ScMvwNA5PIo3gVJl_U45M7Vo",
  authDomain: "uwichem.firebaseapp.com",
  databaseURL: "https://uwichem.firebaseio.com",
  projectId: "uwichem",
  storageBucket: "uwichem.appspot.com",
  messagingSenderId: "297331885020"
}

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatTabsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatGridListModule,
    RouterModule.forRoot(
      appRoutes
    ),
    CommonModule,
    FormsModule,
    NgbModalModule.forRoot(),
    CalendarModule.forRoot(),
    DemoUtilsModule,
  ],
  providers: [{ 
    provide: HAMMER_GESTURE_CONFIG, 
    useClass: HammerGestureConfig 
  }, NotificationService,LoginService],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
