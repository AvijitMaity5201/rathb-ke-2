import { initializeApp } from 'firebase/app';
import firebase from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {getAuth} from "firebase/auth"
const firebaseConfig = {
    apiKey: "AIzaSyCyFj92FcFv92J7leCfkQI5ADQbmmCHR44",
    authDomain: "recipe-app-df3b5.firebaseapp.com",
    projectId: "recipe-app-df3b5",
    storageBucket: "recipe-app-df3b5.appspot.com",
    messagingSenderId: "894806059753",
    appId: "1:894806059753:web:8bab3a9d92cade763e1e78",
    measurementId: "G-P1ZPFL4MCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);
export const FIREBASE_AUTH = getAuth(app)

export { app, db, storage };