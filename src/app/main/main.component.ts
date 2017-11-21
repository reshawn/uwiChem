import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {MatTabGroup, MatTab} from '@angular/material';
import {LoginService} from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  encapsulation: ViewEncapsulation.None, //needed in order to style child components of mat with css
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild(MatTabGroup) group;
  @ViewChildren(MatTab) tabs;
  tab_num = 2;
  selected = 0;
  authstate =null;
  email = null;
  data : any;
  // constant for swipe action: left or right
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  selectChange(): void{ //update selected state if user changes by clicking header
    this.selected = this.group.selectedIndex;

  }

  swipe(eType){ //change selected tab if user swipes the content of a tab
    
    if(eType === this.SWIPE_ACTION.RIGHT && this.selected > 0){
      this.selected--;
    }
    else if(eType === this.SWIPE_ACTION.LEFT && this.selected < this.tab_num){
      this.selected++;
    }
  }


  constructor(public loginservice : LoginService, private router: Router) { 
    this.authstate = loginservice.currentusername ;
    this.email = loginservice.currentEmail;
  }

  //logout currently selling dreams.

  // logOut(){
  //   console.log("SHH SHAABA");
  //   this.loginservice.logout() ;
  //   console.log(this.loginservice.currentusername);
  //   this.router.navigate(['/main'])
  // }

  ngOnInit() {

  }

}
