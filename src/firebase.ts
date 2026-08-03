import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  connectAuthEmulator, 
  onAuthStateChanged,
  signInAnonymously,
  GoogleAuthProvider
} from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator 
} from "firebase/firestore";
import { 
  getFunctions, 
  connectFunctionsEmulator 
} from "firebase/functions";

import firebaseConfig from "./firebase-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

// Use local emulators if configured
const useEmulators = import.meta.env.VITE_USE_EMULATORS === "true";

if (useEmulators) {
  console.log("Connecting to Firebase Emulators...");
  
  // Connect Auth
  connectAuthEmulator(auth, "http://127.0.0.1:9097", { disableWarnings: true });
  
  // Connect Firestore
  connectFirestoreEmulator(db, "127.0.0.1", 8082);
  
  // Connect Cloud Functions
  connectFunctionsEmulator(functions, "127.0.0.1", 5004);
}

export { onAuthStateChanged, signInAnonymously };


