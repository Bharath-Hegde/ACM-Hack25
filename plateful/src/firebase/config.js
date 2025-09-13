// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCUqyukXkGgvG7sZuWqEYekWcxrR--AV0",
  authDomain: "plateful-14dd4.firebaseapp.com",
  projectId: "plateful-14dd4",
  storageBucket: "plateful-14dd4.firebasestorage.app",
  messagingSenderId: "1052766194024",
  appId: "1:1052766194024:web:bc5ee283b7838ff3c8eedd",
  measurementId: "G-44W4CXC5Z3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
