import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Safely extract environment variables in Vite/browser or Node environments
const env = (typeof import.meta !== 'undefined' && import.meta?.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  firebaseConfig.apiKey !== 'your_firebase_api_key'
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.info('[CivicLens Firebase] Connected to Firestore project:', firebaseConfig.projectId);
  } catch (err) {
    console.warn('[CivicLens Firebase] Initialization error, using offline store:', err.message);
  }
} else {
  // Silent or info log in offline mode
}

export { app, db };
