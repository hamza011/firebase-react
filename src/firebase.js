import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "unreadablestuff",
  authDomain: "your-domain-name.firebaseapp.com",
//   databaseURL: "https://your-domain-name.firebaseio.com",
  databaseURL: "https://fir-react-c2791.firebaseio.com/",
  projectId: "fir-react-c2791",
  storageBucket: "gs://fir-react-c2791.appspot.com",
  messagingSenderId: "123123123123"
};
var fire = firebase.initializeApp(config);
export default fire;