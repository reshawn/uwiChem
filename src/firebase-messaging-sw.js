importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '297331885020'
});
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  let notification = payload.notification;
  return registration.showNotification(notification.title, {
    body: notification.body,
    icon: notification.icon
  });
});
