import { Component, OnInit } from '@angular/core';
import { NotificationService, PersistableNotification } from '../notification.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/first';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.css']
})
export class NoticesComponent implements OnInit {

  notifications: BehaviorSubject<PersistableNotification[]>;

  constructor(private notificationService: NotificationService) {
    this.notifications = new BehaviorSubject<PersistableNotification[]>(this.notificationService.retrivePeristedNotifications(true));
  }

  ngOnInit() {
    this.notifications.first().subscribe(notifications => {
      notifications.forEach(notification => {
        this.notificationService.scheduleNotification(notification);
      });
    });
    this.notificationService.currentNotification.subscribe(notification => {
      if(notification === null) return;
      //console.log("Notiifcation: ", notification);
      this.notifications.next(this.notificationService.retrivePeristedNotifications());
    });
  }

  private toDisplayableTime(time: number) : string{
    return new Date(time).toLocaleString();
  }

}
