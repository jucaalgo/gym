import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "jca-gym-app.firebaseapp.com",
    projectId: "jca-gym-app",
    storageBucket: "jca-gym-app.firebasestorage.app",
    messagingSenderId: "449165119408",
    appId: "1:449165119408:web:99531cc1328e34f7361075"
};

// Initialize Firebase with a unique name to bypass HMR stale state
const appName = "ANTIGRAVITY_APP_V2";
let app;

// Robust initialization logic for HMR environments
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig, appName);
} else {
    try {
        // Try to retrieve existing app
        app = getApp(appName);
    } catch (e) {
        // If not found (or if default app exists but ours doesn't), create it
        app = initializeApp(firebaseConfig, appName);
    }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
