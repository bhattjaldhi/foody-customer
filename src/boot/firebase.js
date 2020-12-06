import firebase from "firebase";
import "firebase/firestore";
import FcmBus from 'vue'

import "firebase/auth";
const config = firebase.initializeApp({
  apiKey: "AIzaSyADoTdaJWQbntCVvjlDBSa3iSq6nTVHtnM",
  authDomain: "food-ordering-c3681.firebaseapp.com",
  databaseURL: "https://food-ordering-c3681.firebaseio.com",
  projectId: "food-ordering-c3681",
  storageBucket: "food-ordering-c3681.appspot.com",
  messagingSenderId: "792875295577",
  appId: "1:792875295577:web:b74f7190feffbe044a6248",
  measurementId: "G-DYEBX2QPH1"
});
const auth = firebase.auth();
const db = config.firestore();
firebase.analytics();

export {
  auth,
  firebase
};



export let fcmBus = new FcmBus()

export default ({
  app,
  router,
  store,
  Vue
}) => {

  document.addEventListener("deviceready", async function () {

    updateToken()
    handleTokenRefresh()

    cordova.plugins.firebase.messaging.onMessage(function (data) {
      console.log(JSON.parse(data.payload))
      if (data.type === "UPDATE_ORDER_STATUS") {
        store.commit('updateOrderStatus', JSON.parse(data.payload))
      }
      navigator.notification.beep(3);
    });

    cordova.plugins.firebase.messaging.onBackgroundMessage(function(payload) {
      console.log(JSON.parse(data.payload))
      if (data.type === "UPDATE_ORDER_STATUS") {
        store.commit('updateOrderStatus', JSON.parse(data.payload))
      }
      navigator.notification.beep(1);
  });
  

  }, false);
}






// HANDLE TOKEN : ----------------------------------------------------------------------
// HANDLE TOKEN : ----------------------------------------------------------------------
async function updateToken() {
  let token = await getToken()
  localStorage.setItem('fcm', token);


  // Comment: Firebase token
  console.log('FCM-TOKEN: ', token)
}

function getToken() {
  // FCM: get token and store in localstorage 
  return cordova.plugins.firebase.messaging.getToken()
}

function handleTokenRefresh() {
  // FCM: On token refresh
  cordova.plugins.firebase.messaging.onTokenRefresh(async function () {
    console.log("Device token updated");
    updateToken()
  });
}
