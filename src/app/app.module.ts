import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { MainComponent } from './main/main.component';

import { RouterModule, Routes } from '@angular/router';

import {
  MatTabsModule,
  MatGridListModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

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
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    MatTabsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatGridListModule,
    RouterModule.forRoot(
      appRoutes
    ),
  ],
  providers: [{ 
    provide: HAMMER_GESTURE_CONFIG, 
    useClass: HammerGestureConfig 
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
