import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCEMlZ5a1ulKbhkm6VyutY9gjHm93oJl74",
    authDomain: "dummy-project---code-with-ryan.firebaseapp.com",
    projectId: "dummy-project---code-with-ryan",
    storageBucket: "dummy-project---code-with-ryan.appspot.com",
    messagingSenderId: "842685043856",
    appId: "1:842685043856:web:c89679d1b5a5c19f813415"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth }
