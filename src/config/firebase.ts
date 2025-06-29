
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // IMPORTANT: Replace these with your actual Firebase config values
  // Get these from Firebase Console > Project Settings > General > Your apps
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id-here"
};

// Check if Firebase is properly configured
const isConfigured = firebaseConfig.apiKey !== "your-api-key-here";

if (!isConfigured) {
  console.error("🔥 Firebase is not configured! Please update src/config/firebase.ts with your Firebase project configuration.");
  console.error("📝 Steps to configure:");
  console.error("1. Go to Firebase Console (https://console.firebase.google.com)");
  console.error("2. Select your project or create a new one");
  console.error("3. Go to Project Settings > General > Your apps");
  console.error("4. Copy the configuration object and replace the values in src/config/firebase.ts");
  console.error("5. Enable Authentication > Email/Password in Firebase Console");
  console.error("6. Enable Firestore Database in Firebase Console");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
