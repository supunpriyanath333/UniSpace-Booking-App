import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Change getAuth to these two:
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCWetN-7pdtewBGEScqpEWcslJI_R5tgE0", //
  authDomain: "unispaceapp-3573b.firebaseapp.com", //
  projectId: "unispaceapp-3573b", //
  storageBucket: "unispaceapp-3573b.firebasestorage.app", //
  messagingSenderId: "413544451598", //
  appId: "1:413544451598:web:590d5037c7b0e104ee765f" //
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);