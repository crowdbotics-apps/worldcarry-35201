import * as firebase from 'firebase/app'

const config = {
  apiKey: "AIzaSyAuwJ06_IeJvLZ5qhTTdpj4BQ5VrkQQ8eE",
  authDomain: "worldcarry-402ab.firebaseapp.com",
  databaseURL: 'https://worldcarry-402ab-default-rtdb.firebaseio.com',
  projectId: "worldcarry-402ab",
  storageBucket: "worldcarry-402ab.appspot.com",
  messagingSenderId: "487049617739",
  appId: "1:487049617739:web:62d215bb1c8f64256288ce",
  measurementId: "G-B072QDRP2X"
}

firebase.initializeApp(config)
export const fireBase = firebase
export default firebase
