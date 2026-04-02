import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxZ8zgxAIylRFw2HLGfTu7Pa2R5zOVBF8",
  authDomain: "aloha-96afe.firebaseapp.com",
  projectId: "aloha-96afe",
  storageBucket: "aloha-96afe.firebasestorage.app",
  messagingSenderId: "24200548435",
  appId: "1:24200548435:web:529dcc6a971b959cac36a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
