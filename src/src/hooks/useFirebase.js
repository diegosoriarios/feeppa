import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useState } from "react";
import { API_KEY, APP_ID, AUTH_DOMAIN, DATABASE_URL, MESSAGING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET } from "../../../env_variables";

export default () => {
  const [app, setApp] = useState(null);

  const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    databaseURL: DATABASE_URL,
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

  const findById = async (table, id) => {
    try {
      const db = getFirestore();
      const dbRef = collection(db, table);

      const snapshot = query(dbRef, where('id', '==', id))
      return snapshot;
    } catch (e) {
      console.log("FIND_BY_ID", e);
    }
  }

  const update = (table, values) => {
    const db = getDatabase(app);

    const newKey = push(child(ref(db), table)).key

    const updates = {};
    updates['/table/' + newKey] = values;

    return update(ref(db), updates);
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
    findById,
    remove,
  };
}
