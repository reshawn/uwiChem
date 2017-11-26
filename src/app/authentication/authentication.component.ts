import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {AngularFireDatabase, AngularFireDatabaseModule} from 'angularfire2/database';
import {FirebaseListObservable} from 'angularfire2/es2015';
import {FirebaseAuthState} from 'angularfire2/es2015';
import {AngularFire} from 'angularfire2/es2015';
import {AuthMethods} from 'angularfire2/es2015';
import {AuthProviders} from 'angularfire2/es2015';
import { Router } from "@angular/router";
import * as firebase from 'firebase';
import {AngularFireList} from 'angularfire2/database'
import { AngularFirestore } from 'angularfire2/firestore';
import { Global } from './global';
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  authObservable: Observable<any[]>;
  x:String;
  token: string;
  
  constructor(private db: AngularFireDatabase,public router: Router,private global: Global) { }
  ngOnInit() {
    this.authObservable = this.getAuthCode('/');
    this.getAuthCode('/Chemistry').subscribe(x => {
      this.x=x[0]
      console.log(this.x)
    });
   
  }
  getAuthCode(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }
  Authenticate(){
    this.token, this.x
    if(this.token==this.x) {
      console.log('They have matched the values');
      this.router.navigate(['/main']);

    }else{
      //Do error and redirect
      this.router.navigate(['/login']);
    }
  }


}

