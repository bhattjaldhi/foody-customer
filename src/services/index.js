import RazorPay from './modules/razorpay'
import Firebase from './modules/firebase'

export const API_BASE = process.env.BASE_API_URL


export const FCM_SERVER_KEY = process.env.FIREBASE_API_KEY;
export const FCM_BASE_URL = process.env.FIREBASE_BASE_URL;


export default function Api(store) {
  return {
    baseUrl: API_BASE,
    token: null,
    $store: store,
    razorPay: RazorPay(store),
    firebase: Firebase(store),
  }
}


export function config(store) {
  return {
    headers: {
      'Accept': 'application/json'
    }
  }
}


export function firebaseConfig(store) {
  return {
    headers: {
      'content-type': "application/json",
      Authorization: `key=${FCM_SERVER_KEY}`
    }
  };
}
