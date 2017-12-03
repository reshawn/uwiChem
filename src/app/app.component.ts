import { Component, ViewEncapsulation } from '@angular/core';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'UWIchem';
  constructor(private notificationService: NotificationService){
    this.notificationService.getPermission();
  }
}
