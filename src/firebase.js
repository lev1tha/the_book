import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ─── REPLACE THESE VALUES WITH YOUR FIREBASE PROJECT CONFIG ──────────────────
// 1. Go to https://console.firebase.google.com
// 2. Create / open project → Project settings → Your apps → Web app
// 3. Copy the firebaseConfig object here
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
// ─────────────────────────────────────────────────────────────────────────────

let db = null;
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

if (isConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db, isConfigured };
