import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuKS1p0__sC3dv4bh2FSUX_NyyPbpf_L4",
  authDomain: "events-platform-project-3da30.firebaseapp.com",
  projectId: "events-platform-project-3da30",
  storageBucket: "events-platform-project-3da30.appspot.com",
  messagingSenderId: "761160346849",
  appId: "1:761160346849:web:cc40c261df72c3c2f5dba0",
  measurementId: "G-2EBMNWF55P",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };