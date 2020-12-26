import axios from "axios";

import {
  FCM_BASE_URL,
  firebaseConfig as Config
} from "src/services";

export default store => {
  return {
    $store: store,
    sendNotification(to, title, message, data) {
      let fcmObj = {
        to: to,
        notification: {
          title: title,
          body: message,
          sound: 'sound',
          channelId: 'new_order'
        },
        android: {
          "notification": {
            "channel_id": "new_order",
            "sound": "sound"
          }
        },
        data: data,
        webpush: {
          headers: {
            "Urgency": "high"
          },
          notification: {
            body: message,
            requireInteraction: "true",
          }
        }
      }
      return axios(Object.assign(
          Config(store), {
            method: "post",
            url: FCM_BASE_URL + `/send`,
            data: JSON.stringify(fcmObj)
          }
        ))
        .then(response => {
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    }
  };
};
