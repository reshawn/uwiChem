import { Component } from '@angular/core';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UWIchem';
  constructor(private notificationService: NotificationService){
    this.notificationService.getPermission();
  }
}
