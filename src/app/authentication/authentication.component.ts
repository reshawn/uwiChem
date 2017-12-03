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
import {GlobalsService} from '../globals.service';
import {LoginService} from '../login/login.service';
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  authObservable: Observable<any[]>;
  AdminCode:String;
  token: string;
  stuCode:string;
  errorMsg:string='';
  address:string;
  constructor(private db: AngularFireDatabase,public router: Router,private service:GlobalsService,public loginservice : LoginService) { }
  ngOnInit() {
   
    this.getAuthCode('/Chemistry/Auth').subscribe(AdminCode => {
      this.AdminCode=AdminCode[0]
      
    });
   this.getAuthCode('/Chemistry/Auth').subscribe(stuCode => {
    this.stuCode=stuCode[1]
    
   });
   
  }
  getAuthCode(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }
  Authenticate(){
    this.address=this.loginservice.userID;
    const codeStorage = this.db.object('/Chemistry/users/'+this.address);
    this.token;
    if(this.token==this.AdminCode) { 
      codeStorage.update({ AuthState: 'Admin'});
      codeStorage.update({courseList:''});
      this.service.AuthCode=2;
      this.router.navigate(['/main']);
      
      
    }
    else if(this.token==this.stuCode){
      codeStorage.update({ AuthState: 'Student'});
      codeStorage.update({courseList:''});
      this.service.AuthCode=1;
      this.router.navigate(['/main']);
      
    }
    else if((this.token!=this.AdminCode)&&this.token!=this.stuCode){
      //Do error and redirect
      this.errorMsg='Invalid Code entered. Re-enter code.';
      this.router.navigate(['/authenticate']);
    }
  }


}

