import firebase from 'react-native-firebase';

export default async (message) => {
    // handle your message
    // you can't see this message, because debugger may off when app closed
    // but you can use react native code like fetch, etc ... 
    // const badge = message.data.
    const {badge,title,body} = message.data
    
    const token = await firebase.messaging().getToken()
    firebase.notifications().setBadge(Number(badge))
    console.log("message",message);

    sendPushNotification(token,title,body)
    
    return Promise.resolve();
}

const sendPushNotification = async (token,title,body) => {
  const FIREBASE_API_KEY = 'AIzaSyAzm_xojDYkHmA7IDzE2sjoGpYf-2mzcW0';
  const message = {
    to : token,
    notification: {
      title,
      body
    }
}

  let headers = new Headers({
    "Content-Type": "application/json",
    "Authorization": "key=" + FIREBASE_API_KEY
  });

  let response = await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(message) })
    .then(response => response.json())
    console.log("response",response);
}