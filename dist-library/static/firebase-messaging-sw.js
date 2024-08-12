importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');


firebase.initializeApp({
  apiKey: "AIzaSyCBbhYysThKs2VAQGupRVkISFYWEvQp7FE",
  authDomain: "ipos-30a40.firebaseapp.com",
  databaseURL: "https://ipos-30a40.firebaseio.com",
  projectId: "ipos-30a40",
  storageBucket: "ipos-30a40.appspot.com",
  messagingSenderId: "726601042607",
  appId: "1:726601042607:web:a3d430c650abb6cc84a25a",
  measurementId: "G-SYW36727M8"
});
messaging = firebase.messaging()
messaging.usePublicVapidKey(
  "BAruzBzSw4hHRABxrxB6Pr-0vjTZew0xShzlXZVpolGJr6s-fQ-WzzcE6DPWzG5abhzS9pLWQvG7q9rfj-dPd5s"
);

// messaging.setBackgroundMessageHandler(function (payload) {
//   // console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   let event = payload;
//   try {
//     let data = {}
//     if (event.data) {
//       data = event.data
//     }
//     if (typeof self.registration !== 'undefined' && self.registration !== null) {
//       console.log('data', data)
//       if (data.action === "ORDER_STATUS") {
//         return self.registration.showNotification('IPOS.vn', {
//           body: `Đơn hàng ${data.order_id.toString().toUpperCase()} đã được xác nhận`,
//           icon: 'https://o2otest.iposdev.com/static/favicon.png',
//           requireInteraction: true,
//           data: {
//             url_config: `${self.location.origin}/history/${data.order_id}?session${data.ssid}`
//           },
//           actions: [
//             {
//               action: 'view', title: 'Chi tiết'
//             }
//           ]
//         })
//       }
//     } else {
//     }
//   } catch (e) {
//     console.log('error', e)
//   }
//
//
// });

CONFIG = {
  NOTIFICATION_TITLE: 'Cập nhật trạng thái đơn hàng'
}
self.addEventListener('notificationclick', function (e) {
  let notification = e.notification;
  let action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow(notification.data.url_config);
    notification.close();
  }
});
self.addEventListener('push', async event => {
  let data = {}
  if (event.data) {
    data = event.data.json()
  }
  if (typeof self.registration !== 'undefined' && self.registration !== null) {
    if (data.data.action === "ORDER_STATUS") {
      self.registration.showNotification(CONFIG.NOTIFICATION_TITLE, {
        body: data.data.title ,
        icon: 'http://localhost:6970/static/favicon.ico',
        requireInteraction: true,
        data: {
          url_config: `${self.location.origin}/history/${data.data.order_id}?session=${data.data.ssid}`
        },
        actions: [
          {
            action: 'view', title: 'Chi tiết'
          }
        ]
      })
    }
  } else {
  }
  for (const client of await clients.matchAll({includeUncontrolled: true, type: 'window'})) {
    client.postMessage(event.data.json())
  }
  return null;
})
