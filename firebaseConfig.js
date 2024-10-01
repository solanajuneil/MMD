import {initializeApp} from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC8_7UyNsLuJV6Hmo6Lvnj47bET0qnQgPA",
  authDomain: "myapp-8528a.firebaseapp.com",
  projectId: "myapp-8528a",
  storageBucket: "myapp-8528a.appspot.com",
  messagingSenderId: "1008403820783",
  appId: "1:1008403820783:web:5990876da2e09fa0d76b1a"
};

const app = initializeApp(firebaseConfig)

const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

const FIREBASE_DB = getFirestore(app)
// const usersRef = collection(FIREBASE_DB, 'users')
// const roomRef = collection(FIREBASE_DB, 'rooms')

export {FIREBASE_AUTH, FIREBASE_DB}