import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useState } from "react";

const VITE_API_KEY="AIzaSyDE4e36gfSthVe93dEJPtARjEdmc8apaks"
const VITE_AUTH_DOMAIN="feeppa-727d7.firebaseapp.com"
const VITE_PROJECT_ID="feeppa-727d7"
const VITE_STORAGE_BUCKET="feeppa-727d7.appspot.com"
const VITE_MESSAGING_SENDER_ID="400572205493"
const VITE_APP_ID="1:400572205493:web:618d23cc32edfe1dcbb1fc"
const VITE_DATABASE_URL="https://feeppa-727d7-default-rtdb.europe-west1.firebasedatabase.app/"


export default () => {
  const [app, setApp] = useState(null);

  const firebaseConfig = {
    apiKey: VITE_API_KEY,
    authDomain: VITE_AUTH_DOMAIN,
    projectId: VITE_PROJECT_ID,
    storageBucket: VITE_STORAGE_BUCKET,
    messagingSenderId: VITE_MESSAGING_SENDER_ID,
    appId: VITE_APP_ID,
    databaseURL: VITE_DATABASE_URL,
  };
  
  const initialize = () => {
    const firebaseApp = initializeApp(firebaseConfig);
    setApp(firebaseApp);
  }
  
  const authentication = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      auth.languageCode = "pt-br";
      
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      provider.setCustomParameters({
        'login_hint': 'user@example.com'
      });

      const signIn = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(signIn);
      const token = credential.accessToken

      const user = signIn.user;
      return { token, user }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  }

  const create = async (table, values) => {
    const db = getFirestore();
    
    const docRef = await addDoc(collection(db, table), { values });
    return docRef;
  }

  const read = async (table) => {
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, table));
  
      return snapshot;
    } catch (e) {
      console.log("READ_ERROR", e);
    }
  }

  const find = async (table, id, attribute = 'id') => {
    try {
      const db = getFirestore();
      const dbRef = collection(db, table);

      const snapshot = query(dbRef, where(attribute, '==', id))
      return await getDocs(snapshot);
    } catch (e) {
      console.log("FIND_BY_ID", e);
    }
  }

  const update = async (table, values, id) => {
    try {
      const db = getFirestore();
      const ref = doc(db, table, id);

      return await updateDoc(ref, values);
    } catch (e) {
      console.log("UPDATE_ERROR", e);
    }
  }

  const remove = async (table, id) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, table, id));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  return {
    app,
    authentication,
    initialize,
    create,
    read,
    update,
    find,
    remove,
  };
}
