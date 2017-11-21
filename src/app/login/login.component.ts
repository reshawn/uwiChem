import { Component, OnInit, HostBinding  } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: any;
  user: Observable<firebase.User>;
  //items: FirebaseListObservable<any[]>;

  constructor(public ngFireAuth: AngularFireAuth) {   //add router variable after 
    this.user = ngFireAuth.authState;
  }

  ngOnInit() {
  }

  loginWithGoogle() {
    this.ngFireAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  loginWithFacebook(){
    this.ngFireAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  }

  loginWithEmail(){
    this.ngFireAuth.auth.signInWithRedirect(new firebase.auth.EmailAuthProvider());
  }

  logout() {
    this.ngFireAuth.auth.signOut();
  }

}
