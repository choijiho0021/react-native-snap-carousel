import firebase from 'react-native-firebase';

export default async (message) => {
    // handle your message
    // you can't see this message, because debugger may off when app closed
    // but you can use react native code like fetch, etc ... 
    // const badge = message.data.
    const badge = message.data.badge
    firebase.notifications().setBadge(Number(badge))
    console.log(message); 

    return Promise.resolve();
}