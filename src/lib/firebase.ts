// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase keys are fully valid (non-empty and not dummy placeholders)
export const isFirebaseReady = 
  typeof process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "string" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 0 &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("AIzaSyDIDjK") &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("YOUR_");

let app;
try {
  if (isFirebaseReady) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }
} catch (error) {
  console.error("Failed to initialize Firebase app:", error);
}

export const auth = app ? getAuth(app) : null as unknown as Auth;
export const rtdb = app ? getDatabase(app) : null as unknown as Database;
export const db = app ? getFirestore(app) : null as unknown as Firestore;