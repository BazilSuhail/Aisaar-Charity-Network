import firebase from 'firebase/compat/app';
import { useEffect, useState } from "react";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCzrJ4Rvu5guVQdB43USr6Vnr0CvGRgx5g",
  authDomain: "aisaar-3985a.firebaseapp.com",
  projectId: "aisaar-3985a",
  storageBucket: "aisaar-3985a.appspot.com",
  messagingSenderId: "326493818088",
  appId: "1:326493818088:web:28fb284516bea5837acd5d",
  measurementId: "G-VW81E19PNQ"
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
