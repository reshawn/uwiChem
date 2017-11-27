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
  notifications: PersistableNotification[];
  static NOTIFICATON_EXISTS = 'notifications_exits';
  static NOTIFICATIONS = 'notifications';
  static TIME_DAY = 86400000;

  constructor(private database: AngularFireDatabase, private auth: AngularFireAuth){
    this.supportsNotifications = "Notification" in window;
    this.handlePayload = this.handlePayload.bind(this);
    this.notifications = this.retrivePeristedNotifications();
  }

  /**
   * Request permission to display notifications and setup the handler for Firebase Messaging
   */
  getPermission(){
    if(this.supportsNotifications)
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

  /**
   * Update the FCM token for the current user in the database
   * @param token User's FCM Token
   */
  private updateToken(token: string){
    this.auth.authState.take(1).subscribe(user => {
      if (!user) return;
      this.database.object(`fcmTokens/${user.uid}`).set(token);
    });
  }

  /**
   * Extract the notification from the payload; schedule the notification; and persist it in the database
   * @param payload FCM Messaging Payload
   */
  private handlePayload(payload: FCMPayload){
    let notification = this.createPersistableNotificationFromPayload(payload);
    this.currentNotification.next(notification);
    this.scheduleNotification(notification);
    this.persistNotification(notification);
  }

  /**
   * Schedule a notiification to be displayed if its display time hasn't passed and if it is to be displayed in the current day
   * @param notification Notification to Display
   * @returns true if scheduled false otherwise
   */
  scheduleNotification(notification: PersistableNotification) : boolean{
    let currentTime = Date.now(), timeUntilDisplay = notification.displayTime - currentTime;
    if(notification.displayTime > currentTime && timeUntilDisplay < NotificationService.TIME_DAY){
      setTimeout(() => {
        this.displayNotification(notification);
      }, timeUntilDisplay);
      return true;
    }
    return false;
  }

  /**
   * Display a notification
   * @param persistableNotification Notification to Display
   */
  displayNotification(persistableNotification: PersistableNotification){
    let notification = new Notification(persistableNotification.title, {
      body: persistableNotification.text,
      icon: persistableNotification.icon
    });
    setTimeout(() => {
      notification.close();
      //TODO: Schedule next notiifcation
    }, 10000);
  }

  /**
   * Save the current notificiation
   * @param notification Notification to persist
   */
  persistNotification(notification: PersistableNotification){
    this.notifications.push(notification);
    this.notifications = this.invalidateExpiredPersistedNotifications(this.notifications);
    localStorage.setItem(NotificationService.NOTIFICATON_EXISTS, 'true');
    localStorage.setItem(NotificationService.NOTIFICATIONS, JSON.stringify(this.notifications));
  }

  /**
   * Save all notifications to the cache
   * @param notifications Notifications to persist
   */
  persistNotifications(notifications: PersistableNotification[]){
    if(!notifications || notifications.length === 0) 
      localStorage.setItem(NotificationService.NOTIFICATON_EXISTS, 'false');
    else{
      localStorage.setItem(NotificationService.NOTIFICATON_EXISTS, 'true');
      localStorage.setItem(NotificationService.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }

  /**
   * Retrieve the notifications persisted notifications
   */
  retrivePeristedNotifications() : PersistableNotification[]{
    let notificaitonsExists = localStorage.getItem(NotificationService.NOTIFICATON_EXISTS) === 'true';
    if(!notificaitonsExists) return [];
    let persistedNotifications = JSON.parse(localStorage.getItem(NotificationService.NOTIFICATIONS));
    persistedNotifications = this.invalidateExpiredPersistedNotifications(persistedNotifications);
    this.persistNotifications(persistedNotifications);
    return persistedNotifications
  }

  /**
   * Remove the notifications whose time has expired
   * @param notifications Notifications
   */
  private invalidateExpiredPersistedNotifications(notifications: PersistableNotification[]) : PersistableNotification[]{
    let currentTime = Date.now();
    return notifications.filter(notification => currentTime <= notification.expireAt);
  }

  /**
   * Create a PersistableNotification from the contents of the FCM Payload
   * @param payload FCM Payload
   */
  private createPersistableNotificationFromPayload(payload: FCMPayload) : PersistableNotification{
    let fcmNotification = payload.notification;
    let body: FCMNotificationBody = JSON.parse(fcmNotification.body);
    return {
      title: fcmNotification.title,
      text: body.text,
      icon: fcmNotification.icon,
      recievedAt: Date.now(),
      displayTime: body.displayTime,
      expireAt: body.expireAt
    };
  }

  createPersistableNotificationFromEvent(event) : PersistableNotification{
    return null;
  }

}

interface FCMNotificationBody {
  text: string;
  displayTime: number;
  expireAt: number;
}

interface FCMNotification {
  body: string;
  title: string;
  icon: string;
}

interface FCMPayload{
  from: string;
  collapse_key: string;
  notification: FCMNotification;
}

export interface PersistableNotification {
  title: string;
  text: string;
  icon: string;
  recievedAt: number;
  displayTime: number;
  expireAt: number;
}