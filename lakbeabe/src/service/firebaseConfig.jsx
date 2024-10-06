// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFPXpcsxpRtueXNhzVQ2r8Hp61YU8HrBk",
  authDomain: "lakbeabe.firebaseapp.com",
  projectId: "lakbeabe",
  storageBucket: "lakbeabe.appspot.com",
  messagingSenderId: "681354611325",
  appId: "1:681354611325:web:ef55a8aab562bff7f0bf14",
  measurementId: "G-36XZ6VJ1Q5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
// const analytics = getAnalytics(app);