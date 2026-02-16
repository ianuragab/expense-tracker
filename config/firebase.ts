// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp87uFTl3-9XoLVnB8150QmrXU8gf1Txk",
  authDomain: "expense-tracker-f9cb1.firebaseapp.com",
  projectId: "expense-tracker-f9cb1",
  storageBucket: "expense-tracker-f9cb1.firebasestorage.app",
  messagingSenderId: "382110429402",
  appId: "1:382110429402:web:bd24df31553b9a261f75e3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// database
export const firestore = getFirestore(app);
