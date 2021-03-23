import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDybWL0s_f-iVkv6PVVZ42DVB4XrwdikC4',
  authDomain: 'instagram-clone-bcc4c.firebaseapp.com',
  databaseURL: 'https://instagram-clone-bcc4c-default-rtdb.firebaseio.com',
  projectId: 'instagram-clone-bcc4c',
  storageBucket: 'instagram-clone-bcc4c.appspot.com',
  messagingSenderId: '485549976153',
  appId: '1:485549976153:web:2625591903991577a95f48',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
