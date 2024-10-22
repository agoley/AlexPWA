"use strict";
/*
For More info on service workers read:
https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
https://developers.google.com/web/fundamentals/primers/service-workers/
*/

const myCache = "alexgoley-v1";
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(myCache).then(function (cache) {
      return cache.addAll([
        "/",
        "static/styles/index.css",
        "static/img/profile.jpg",
        "static/img/profile_medium.jpg",
        "static/img/profile_small.jpg",
        "static/img/profile_offline.jpg",
        "static/js/notifications.js",
      ]);
    }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(staleWhileRevalidate(event));
});

function getProfileImg(request) {
  let url = request.url;
  // Connection Type is not available yet
  // https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
  // navigator.connection.type === 'cellular'
  // http://wicg.github.io/netinfo/#effective-connection-types
  try {
    let size = {
      "2g": "small",
      "3g": "medium",
      "4g": "medium",
      "slow-2g": "small",
    }[navigator.connection.effectiveType];

    return url.replace(/\.[a-z]*$/, `_${size}$&`);
  } catch (e) {
    return url;
  }
}

const staleWhileRevalidate = (event) =>
  caches.open(myCache).then((cache) => {
    let request = event.request;
    if (/profile\.jpg$/.test(event.request.url)) {
      request = getProfileImg(event.request);
    }

    return cache.match(request).then((response) => {
      let fetchPromise = fetch(request)
        .then((networkResponse) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })
        .catch((e) => caches.match("/static/img/profile.jpg"));
      return response || fetchPromise;
    });
  });

self.addEventListener("notificationclose", (e) => {
  console.log("Closed notification: ", e);
  //Can't do this! InvalidAccessError
  //e.waitUntil(clients.openWindow('/404'));
  e.notification.close();
});

self.addEventListener("notificationclick", ({ notification, action }) => {
  clients.openWindow("https://www.linkedin.com/in/alex-goley-6230479b/");
  notification.close();
});

// self.addEventListener("push", function (event) {
//   let title, body;

//   try {
//     ({ title, body } = event.data.json());
//   } catch (error) {
//     title = "Dev Tools Push";
//     body = event.data.text();
//   }

//   event.waitUntil(
//     self.registration.showNotification(title, {
//       body: body,
//       icon: "static/img/icons/icon-144x144.png",
//       image: "static/img/profile_small.jpg",
//       tag: "push-alert",
//     }),
//   );
// });

self.addEventListener("push", function (event) {
  console.log("Received a push message", event);

  // Display notification or handle data
  // Example: show a notification
  const title = "New Notification";
  const body = event.data.text();
  const icon = "static/img/icons/icon-144x144.png";
  const tag = "simple-push-demo-notification-tag";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag,
    }),
  );

  // Attempt to resubscribe after receiving a notification
  event.waitUntil(resubscribeToPush());
});

// Use this to check if the user already has your site open and send it a postMessage
function messageClientWindows() {
  return clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      windowClients.forEach((windowClient) => {
        windowClient.postMessage({
          message: "Received a push message.",
          time: new Date().toString(),
        });
      });
    });
}
