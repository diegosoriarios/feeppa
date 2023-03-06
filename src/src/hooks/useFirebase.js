import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useState } from "react";
import { API_KEY, APP_ID, AUTH_DOMAIN, DATABASE_URL, MESSAGING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET } from "../../../env_variables";

export default () => {
  const [app, setApp] = useState(null);

  const firebaseConfig = {
    apiKey: process.env.API_KEY || API_KEY,
    authDomain: process.env.AUTH_DOMAIN || AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID ||  PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET ||  STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID ||  MESSAGING_SENDER_ID,
    appId: process.env.APP_ID ||  APP_ID,
    databaseURL: process.env.DATABASE_URL ||  DATABASE_URL,
  };
  
  const initialize = () => {
    const firebaseApp = initializeApp(firebaseConfig);
    console.log(firebaseApp);
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
