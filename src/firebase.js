import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCwnSlSt7hjeqQXUOzs4gnEnf2ytlHsvj4",
    authDomain: "fir-4ec77.firebaseapp.com",
    databaseURL: "https://fir-4ec77-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fir-4ec77",
    storageBucket: "fir-4ec77.firebasestorage.app",
    messagingSenderId: "574378130286",
    appId: "1:574378130286:web:c3911a833866526b41df7f",
    measurementId: "G-HNL3C1ZKHL"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app); 