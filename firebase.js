// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBmCizdndPh1BtgwnYbAlStTunB08yx0Q",
  authDomain: "airbnb-1c2db.firebaseapp.com",
  projectId: "airbnb-1c2db",
  storageBucket: "airbnb-1c2db.appspot.com",
  messagingSenderId: "759586950873",
  appId: "1:759586950873:web:e09f8d3261c24cbd6378c8",
  measurementId: "G-DXYEJEY91T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
