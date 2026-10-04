import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlz6jMOYuJzWVd7pLTyAR8lkBJbAHYq40",
  authDomain: "cvbuilder-13804.firebaseapp.com",
  projectId: "cvbuilder-13804",
  storageBucket: "cvbuilder-13804.firebasestorage.app",
  messagingSenderId: "419200286217",
  appId: "1:419200286217:web:97f273a6b15db78f8342d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
