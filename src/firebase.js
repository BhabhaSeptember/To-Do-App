import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_JpJ0ribdYnY29baXFkU_r5KN4Mrt_Cc",
  authDomain: "todo-app-tut-b8893.firebaseapp.com",
  databaseURL: "https://todo-app-tut-b8893-default-rtdb.firebaseio.com",
  projectId: "todo-app-tut-b8893",
  storageBucket: "todo-app-tut-b8893.firebasestorage.app",
  messagingSenderId: "771309524832",
  appId: "1:771309524832:web:a9762185376a9c4ba73005",
  measurementId: "G-KX5S6PQCBL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth();