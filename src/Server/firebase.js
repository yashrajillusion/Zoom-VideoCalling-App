import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyC02_hdO043ziiIedAIMCz_XbkgvgYiOHc", // Add API Key
  databaseURL: "https://yashrajillusion2-default-rtdb.firebaseio.com", // Add databaseURL
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const dbRef = firebase;

let firepadRef = firebase.database().ref();
export let connectedRef = firebase.database().ref(".info/connected");
export const userName = prompt("What's your name?");
// export const userName = "Yash";
const urlparams = new URLSearchParams(window.location.search);
const roomId = urlparams.get("id");

if (roomId) {
  firepadRef = firepadRef.child(roomId);
} else {
  firepadRef = firepadRef.push();
  window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);
}

export default firepadRef;
