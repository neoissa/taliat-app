import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCpcSwYcwUQ_f7_0BgYtQzKxSMnsZ2e6CE",
  authDomain: "taliat-portal.firebaseapp.com",
  projectId: "taliat-portal",
  storageBucket: "taliat-portal.firebasestorage.app",
  messagingSenderId: "258276231531",
  appId: "1:258276231531:web:035f8c04d21a68f33ca42e",
  measurementId: "G-VQSJ9ZFKLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Authentication and Firestore Database
export const auth = getAuth(app);
export const db = getFirestore(app);