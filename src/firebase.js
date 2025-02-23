


import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVr7-6dfdZiAAL-tJehBcdzlF5n-1QcXo",
  authDomain: "office-3e5ab.firebaseapp.com",
  projectId: "office-3e5ab",
  storageBucket: "office-3e5ab.firebasestorage.app",
  messagingSenderId: "403319571509",
  appId: "1:403319571509:web:0d26afefacb04b281d1d7c",
  measurementId: "G-E9QFYWY75S"
};


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const db = getFirestore(app);
  
  export { auth, provider, db };
