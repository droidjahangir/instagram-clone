import firebase from 'firebase';

// initialize firebase, this code we will find in firebase project settings > config
// these secure api key or others need not to store outside env variable for security
// because firebase can't accept any request outside the app.
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBoDd_D49luC272_WnCbPbi9ftNS9EGaG8",
  authDomain: "instagram-clone-react-18f44.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-18f44-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-18f44",
  storageBucket: "instagram-clone-react-18f44.appspot.com",
  messagingSenderId: "125510787528",
  appId: "1:125510787528:web:ba46ea9817c8122bbfe0fd"
});

// apiKey: "AIzaSyBoDd_D49luC272_WnCbPbi9ftNS9EGaG8",
// authDomain: "instagram-clone-react-18f44.firebaseapp.com",
// projectId: "instagram-clone-react-18f44",
// storageBucket: "instagram-clone-react-18f44.appspot.com",
// messagingSenderId: "125510787528",
// appId: "1:125510787528:web:ba46ea9817c8122bbfe0fd"

// just initialize these services.
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
