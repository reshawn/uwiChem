const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const database = admin.database();
const messageing = admin.messaging();

/**
 * Create a notification payload for FCM
 * @param {string} to FCM token for recipient
 * @param {string} title title
 * @param {string} text text
 * @param {number | Date} displayTime display time
 * @param {number | Date} expireAt expire time
 * @param {string} icon icon
 */
function makeNotification(title, text, displayTime, expireAt, icon) {
  
  if(displayTime instanceof Date) displayTime = displayTime.getTime();
  if(expireAt instanceof Date) expireAt = expireAt.getTime();

  return {
    'notification': {
      'title': title, 
      'body': JSON.stringify({
        'text': text,
        'displayTime': displayTime,
        'expireAt': expireAt,
        'icon': icon
      }),
    }
  };
}

exports.sendMessagesForEvent = functions.https.onRequest((request, response) => {
  return database.ref('fcmTokens').once('value')
  .then(tokensSnapshot => tokensSnapshot.val())
  .then(fcmTokens => {
    let tokens = [];
    for(let key in fcmTokens){
      tokens.push(fcmTokens[key]);
    }
    return tokens;
  })
  .then(tokens => {
    let eventNotification = request.body;
    let notification = makeNotification(eventNotification.title, eventNotification.text, eventNotification.displayTime, eventNotification.expireAt, '');
    return messageing.sendToDevice(tokens, notification);
  })
  .then(response => console.log('Messages sent:', response))
  .catch(error => console.log(error));
});
