// firebase.js
import React from 'react';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDGHI6qFtLX3g4A69e_Fm8ibPvEi_4WBGQ",
    authDomain: "creativeblock-5c8f2.firebaseapp.com",
    projectId: "creativeblock-5c8f2",
    storageBucket: "creativeblock-5c8f2.appspot.com", // fixed typo: should be .app**spot**.com
    messagingSenderId: "104040782591",
    appId: "1:104040782591:web:e47126ba12e93a531d4aca",
    measurementId: "G-L80N0M7QKV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };