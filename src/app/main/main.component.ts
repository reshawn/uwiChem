import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {MatTabGroup, MatTab} from '@angular/material';
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
  // constant for swipe action: left or right
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  selectChange(): void{ //update selected state if user changes by clicking header
    this.selected = this.group.selectedIndex;
    console.log("Selected INDEX: " + this.selected);

  }

  swipe(eType){ //change selected tab if user swipes the content of a tab
    console.log(eType);
    if(eType === this.SWIPE_ACTION.RIGHT && this.selected > 0){
      console.log("movin left")
      this.selected--;
    }
    else if(eType === this.SWIPE_ACTION.LEFT && this.selected < this.tab_num){
      console.log("movin right")
      this.selected++;
    }
    console.log(this.selected)
  }


  constructor() { }

  ngOnInit() {
    
  }

}
