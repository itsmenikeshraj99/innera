import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Google aur Facebook dono ke auth modules import karein
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyDZb8ZxJiSkw2kzW0otyqWFPUnVDXHT9g8",
  authDomain: "innera-2f427.firebaseapp.com",
  projectId: "innera-2f427",
  storageBucket: "innera-2f427.firebasestorage.app",
  messagingSenderId: "816950788024",
  appId: "1:816950788024:web:920e6fb4e141bafe7d994d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

// Dono providers initialize kiye
const googleProvider = new GoogleAuthProvider(); 
const facebookProvider = new FacebookAuthProvider();

// Sabko export kar diya taaki baaki app mein use kar sakein
export { db, auth, googleProvider, facebookProvider };