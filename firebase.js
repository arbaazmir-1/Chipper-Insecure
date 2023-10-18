// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";





// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtziBoWmw9FmHBgGfnLMlsvHyneF5uqQk",
  authDomain: "nosecurity-chat.firebaseapp.com",
  projectId: "nosecurity-chat",
  storageBucket: "nosecurity-chat.appspot.com",
  messagingSenderId: "779317988816",
  appId: "1:779317988816:web:6f21dbb5b01d354863bdd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db}
