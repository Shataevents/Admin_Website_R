// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDYN3SV_IApa52ftkGQE67D8FwbWNJIBFo",
//   authDomain: "shata-bd22f.firebaseapp.com",
//   projectId: "shata-bd22f",
//   storageBucket: "shata-bd22f.firebasestorage.app",
//   messagingSenderId: "926646791500",
//   appId: "1:926646791500:web:a21bc2edb7923efff9f3e9",
//   measurementId: "G-QV6H6881CM"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json"); // Download from Firebase

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYN3SV_IApa52ftkGQE67D8FwbWNJIBFo",
  authDomain: "shata-bd22f.firebaseapp.com",
  projectId: "shata-bd22f",
  storageBucket: "shata-bd22f.appspot.com",
  messagingSenderId: "926646791500",
  appId: "1:926646791500:web:a21bc2edb7923efff9f3e9",
  measurementId: "G-QV6H6881CM"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
