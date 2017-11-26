import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class LoginService {

  authstate: any;
  data: any;
  addUserRef: AngularFireObject<any>;
  userEmail: String;
  userName: String;
  constructor(public ngFireAuth: AngularFireAuth, private router: Router, private db: AngularFireDatabase) {

    ngFireAuth.authState.subscribe(auth => {      //a promise that subscribed the observable and returns the authstate.
      this.authstate = auth;
    })



  }


  saveUserEmail(emailAddress): void {
    var splitMail: String[] = emailAddress.split("@");
    var mail = splitMail[0];
    this.db.object('Chemistry/users/' + this.authstate.uid).valueChanges().subscribe(userSearch => {
      if (userSearch == null) {
        this.addUserRef = this.db.object('Chemistry/users/' + this.authstate.uid);
        this.addUserRef.set({
          name: this.authstate.displayName,
          email: this.authstate.email
        });
      }

    });
  }

  get currentusername(): any {       //getter to call in other components to manipulate user data
    if (this.authstate) {
      return this.authstate.displayName;
    }

  }
  
  get userID(): any {
    if(this.authstate){
      return this.authstate.uid;
    }
  }

  get currentEmail(): any {      //getter to call in other components to manipulate user data
    if (this.authstate) {
      return this.authstate.email;
    }
  }



  //for consistent and proper functionality, the result of the signin function needs to be made into a promise that specifis what to do
  //when the result is finished. Since its asynchronous, leaving out the promise would lead to inconsistent debugging because its not always
  //certain of the order in which asynchronous code works. (its variable)
  //plus i'm pretty sure there are a bunch of different reasons for actually using promises, don't care atm.

  //important to note that i switched to the signinwithpopup from the signin with redirect function because i dont fucking know 
  //how to specify where to redirect other than reloading the page (docs in 2k17 lads)
  //that fixed the weird problem with routerlinks and signins
  
  loginWithGoogle() {
    this.ngFireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
      if (this.authstate) {

        console.log(this.authstate.displayName);
        console.log(this.authstate.email);
      }
    }).catch(error => {
      console.log("AHH SHIBAAA");
      console.log(error);
    });
    this.router.navigate(['/main'])     //navigating first incase saving user email takes long eventually.
    console.log("Email to be added: " + this.authstate.email);
    this.saveUserEmail(this.authstate.email);
  }

  loginWithFacebook() {
    this.ngFireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(result => {
      if (this.authstate) {
        console.log(this.authstate.displayName);
        console.log(this.authstate.email);
      }
    }).catch(error => {
      console.log("AHH SHIBAAAI");
      console.log(error);
    });
    this.router.navigate(['/main'])
    console.log("Email to be added: " + this.authstate.email);
    this.saveUserEmail(this.authstate.email);
  }

  loginWithEmail() {
    this.ngFireAuth.auth.signInWithRedirect(new firebase.auth.EmailAuthProvider());
  }

      //logout mysteriously doesn't work

      // logout() : void {
      //    this.ngFireAuth.auth.signOut();
      //   //navigate if neccessary  or this.router.navigate(['/'])
      // }

}
