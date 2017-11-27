import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';

import {
  MatTabsModule,
  MatGridListModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { AuthenticationComponent } from './authentication/authentication.component';
import {GlobalsService} from './globals.service';
export const firebaseConfig = {
  apiKey: "AIzaSyARJaQ6IU3ScMvwNA5PIo3gVJl_U45M7Vo",
  authDomain: "uwichem.firebaseapp.com",
  databaseURL: "https://uwichem.firebaseio.com",
  projectId: "uwichem",
  storageBucket: "uwichem.appspot.com",
  messagingSenderId: "297331885020"
}

const appRoutes: Routes = [
  { path: '', component:LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  {path: 'authenticate',component:AuthenticationComponent},

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    AuthenticationComponent,
  ],
  imports: [
    AngularFireDatabaseModule,
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
    FormsModule,
  ],
  providers: [{ 
    provide: HAMMER_GESTURE_CONFIG, 
    useClass: HammerGestureConfig,
},GlobalsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
