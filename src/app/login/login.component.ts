import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { LoginService } from './login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authstate: any;
  error: any;

  constructor(private router: Router, public loginservice: LoginService) {   //add router variable after 
    
  }

  ngOnInit() {

  }

  signInGoogle() {
    this.loginservice.loginWithGoogle();
  }

  signInFacebook() {
    this.loginservice.loginWithFacebook();
  }

}
