import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWetN-7pdtewBGEScqpEWcslJI_R5tgE0",
  authDomain: "unispaceapp-3573b.firebaseapp.com",
  projectId: "unispaceapp-3573b",
  storageBucket: "unispaceapp-3573b.firebasestorage.app",
  messagingSenderId: "413544451598",
  appId: "1:413544451598:web:590d5037c7b0e104ee765f",
  measurementId: "G-3BSTD7QMWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use them in other files
export const auth = getAuth(app);
export const db = getFirestore(app);