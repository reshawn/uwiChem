import { Component, OnInit, HostBinding  } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authstate : any ;
  error: any;
<<<<<<< HEAD
  user: Observable<firebase.User>;
  //items: FirebaseListObservable<any[]>;

  constructor(public ngFireAuth: AngularFireAuth) {   //add router variable after 
    this.user = ngFireAuth.authState;
=======

  constructor(private router: Router, public loginservice : LoginService) {   //add router variable after 
    
>>>>>>> OAauth
  }

  ngOnInit() {
  }

  signInGoogle(){
    this.loginservice.loginWithGoogle();
  }

  signInFacebook(){
    this.loginservice.loginWithFacebook();
  }


  // loginWithEmail(){
  //   this.ngFireAuth.auth.signInWithRedirect(new firebase.auth.EmailAuthProvider());
  // }

}
