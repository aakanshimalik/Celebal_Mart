import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB181m4WDYM4NiMDwKB4V7VdYhb7qi7rpY",
  authDomain: "ecommerce-574c3.firebaseapp.com",
  projectId: "ecommerce-574c3",
  storageBucket: "ecommerce-574c3.firebasestorage.app",
  messagingSenderId: "936928742279",
  appId: "1:936928742279:web:4f5c71f18b74d18fe7a122"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);

export {fireDB,auth } ;