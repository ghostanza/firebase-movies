import firebase from 'firebase';
const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DB_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};

module.exports.init = () => {
  firebase.initializeApp(config);
}

module.exports.db = (path) => {
  return firebase.database().ref(path);
}
module.exports.signInWithGoogle = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt: 'select_account'});
  firebase.auth().signInWithPopup(provider);
}
module.exports.signOut = (userID) => {
  if(userID){
    firebase.database().ref(`users/${userID}/online`).set(false);
  }
  firebase.auth().signOut();
}

module.exports.onAuthStateChanged = (callback) => {
  firebase.auth().onAuthStateChanged(callback);
}
