import * as firebase from 'firebase';

// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDSt0ohNFqxx9RJNgisw5_LiNi52DGVFvU",
    authDomain: "gql-fullstack.firebaseapp.com",
    projectId: "gql-fullstack",
    storageBucket: "gql-fullstack.appspot.com",
    // messagingSenderId: "1033890705328",
    appId: "1:1033890705328:web:2f5602926e4bdeb8143075"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();