import firebase from 'firebase/compat/app';
import { useEffect, useState } from "react";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCh1HTmU0Eoaojgi7nnWxQlqoIvt-MvL4k",
  authDomain: "charity-management-syste-6c5f7.firebaseapp.com",
  databaseURL: "https://charity-management-syste-6c5f7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "charity-management-syste-6c5f7",
  storageBucket: "charity-management-syste-6c5f7.appspot.com",
  messagingSenderId: "533819495425",
  appId: "1:533819495425:web:879fba64f8eec103531c00",
  measurementId: "G-FBVBWL9BSZ"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const fs = firebase.firestore();
const st = firebase.storage();
const FieldValue = firebase.firestore.FieldValue;

const useFirebaseAuth = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { currentUser: auth.currentUser, loading };
};

export { auth, fs, st, FieldValue, useFirebaseAuth }
