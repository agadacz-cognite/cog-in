import firebase from 'firebase/app';
import 'firebase/firestore';
import { errorHandler } from '../shared';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  authDomain: 'cog-in.firebaseapp.com',
  databaseURL: 'https://cog-in-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'cog-in',
  storageBucket: 'cog-in.appspot.com',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (error) {
    errorHandler(error);
  }
} else {
  try {
    firebase.app();
  } catch (error) {
    errorHandler(error);
  }
}

export const db = firebase.firestore();

export * from './utils';
export default firebase;
