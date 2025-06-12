import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC7XZO0-IUUUorSk-0aW0mE5c9_6Cwz0Xc",
  authDomain: "online-catalog-ac551.firebaseapp.com",
  projectId: "online-catalog-ac551",
  storageBucket: "online-catalog-ac551.firebasestorage.app",
  messagingSenderId: "542848688045",
  appId: "1:542848688045:web:07781f76625da020290b24",
  measurementId: "G-6XY9H4K1SP"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app) 