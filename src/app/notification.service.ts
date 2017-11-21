import { Injectable }          from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth }     from 'angularfire2/auth';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NotificationService {
  messaging = firebase.messaging();
  currentNotification = new BehaviorSubject<PersistableNotification>(null);
  supportsNotifications: boolean;
  hasNotificationPermission: boolean;
  static NOTIFICATON_EXISTS = 'notifications_exits';
  static NOTIFICATIONS = 'notifications';

  constructor(private database: AngularFireDatabase, private auth: AngularFireAuth) {
    this.supportsNotifications = "Notification" in window;
    this.handlePayload = this.handlePayload.bind(this);
  }

  getPermission() {
    if(!this.supportsNotifications) return;
    this.messaging.requestPermission()
    .then(() => {
      console.log('Notification permission granted.');
      this.hasNotificationPermission = true;
      return this.messaging.getToken();
    })
    .then((token: string) => {
      this.updateToken(token);
      this.messaging.onMessage(this.handlePayload);
    })
    .catch(err => {
      this.hasNotificationPermission = false;
      console.log('Unable to get permission to notify.', err);
    });
  }

  private updateToken(token: string) {
    this.auth.authState.take(1).subscribe(user => {
      if (!user) return;
      this.database.object(`fcmTokens/${user.uid}`).set(token);
    });
  }

  private handlePayload(payload: FCMPayload){
    let notification = this.createPersistableNotification(payload);
    this.currentNotification.next(notification);
    this.displayNotification(notification);
    this.persistNotification(notification);
  }

  displayNotification(persistableNotification: PersistableNotification){
    let notification = new Notification(persistableNotification.title, {
      body: persistableNotification.text,
      icon: persistableNotification.icon
    });
  }

  persistNotification(notification: PersistableNotification){
    let notifications = this.retrivePeristedNotifications();
    notifications.push(notification);
    localStorage.setItem(NotificationService.NOTIFICATON_EXISTS, 'true');
    localStorage.setItem(NotificationService.NOTIFICATIONS, JSON.stringify(notifications));
  }

  retrivePeristedNotifications() : PersistableNotification[]{
    let notificaitonsExists = localStorage.getItem(NotificationService.NOTIFICATON_EXISTS) === 'true';
    if(!notificaitonsExists) return [];
    let persistedNotifications = JSON.parse(localStorage.getItem(NotificationService.NOTIFICATIONS));
    return this.invalidateExpiredPersistedNotifications(persistedNotifications);
  }

  private invalidateExpiredPersistedNotifications(notifications: PersistableNotification[]) : PersistableNotification[]{
    let currentTime = Date.now();
    return notifications.filter(notification => currentTime <= notification.expireAt);
  }

  private createPersistableNotification(payload: FCMPayload) :PersistableNotification {
    let fcmNotification = payload.notification;
    let body = JSON.parse(fcmNotification.body);
    return {
      title: fcmNotification.title,
      text: body.text,
      icon: fcmNotification.icon,
      recievedAt: Date.now(),
      expireAt: body.expireAt
    };
   }

}

interface FCMNotification {
  body: string;
  title: string;
  icon: string;
}

interface FCMPayload{
  from: string;
  collapse_key: string;
  notification: FCMNotification 
}

interface PersistableNotification {
  title: string;
  text: string;
  icon: string;
  recievedAt: number;
  expireAt: number;
}