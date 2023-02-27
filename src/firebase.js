import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtnqx_fvrPCBm8FL7JZXOp57Exae5RhW8",
  authDomain: "diyora-insta.firebaseapp.com",
  projectId: "diyora-insta",
  storageBucket: "diyora-insta.appspot.com",
  messagingSenderId: "710659655819",
  appId: "1:710659655819:web:a4e0e81e7153ee978e2c8e",
  measurementId: "G-DDWP5X7GC5"
};

const fbApp = firebase.initializeApp(firebaseConfig);
const db = fbApp.firestore();
const auth = fbApp.auth();
const storage = fbApp.storage();

export { db, auth, storage };
