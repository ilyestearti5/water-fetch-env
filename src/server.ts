import { Server } from "water-fetch/ui/apis";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
export const server = new Server({
  appId: "1:911813185967:web:82a9e08ffb88e8c9315f5a",
  measurementId: "G-WFMHHED4ZD",
  projectId: import.meta.env.VITE_PROJECT_ID,
});
export const firebaseApp = initializeApp(server.config);
export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
