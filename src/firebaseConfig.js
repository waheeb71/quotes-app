// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcOvpfciwEx5_ieBNqqXCApmeUfU3UIHI",
  authDomain: "cyberlirn.firebaseapp.com",
  projectId: "cyberlirn",
  storageBucket: "cyberlirn.firebasestorage.app",
  messagingSenderId: "388613022037",
  databaseURL: "https://cyberlirn-default-rtdb.firebaseio.com",
  appId: "1:388613022037:web:8c26f10bb1ed561bbd4fdc",
  measurementId: "G-H9MW9HHSHX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
