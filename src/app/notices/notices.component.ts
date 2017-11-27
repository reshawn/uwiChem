import { Component, OnInit } from '@angular/core';
import { NotificationService, PersistableNotification } from '../notification.service';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.css']
})
export class NoticesComponent implements OnInit {

  notifications: PersistableNotification[];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notifications = this.notificationService.retrivePeristedNotifications();
  }

  private toDisplayableTime(time: number) : string{
    return new Date(time).toDateString();
  }

}
