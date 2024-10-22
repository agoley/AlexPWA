//The spec: https://notifications.spec.whatwg.org/
const MyNotification = {
  body: "This is getting personal! Lets connect 😆",
  icon: "static/img/linkedin-secondary-136x136.png",
  // Doesn't work on Apple!
  image: "static/img/icons/icon-384x384.png",
  //Sound is not supported... YET
  //   sound: "/static/sounds/BOTW_Fanfare_HeartContainer.wav",
  //Keeps the notification displayed
  requireInteraction: false,
  // don't play a sound
  silent: false,
  // Vibration: Star Wars shamelessly taken from the awesome Peter Beverloo
  // https://tests.peter.sh/notification-generator/
  // vibrate: [
  //   500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170,
  //   40, 500,
  // ],
  //Unique identifier for this notification
  tag: new Date().getTime(),
};

const hugsButton = document.getElementById("hugsButtonTag");

function addClickEvent(notification) {
  notification.onclick = function (event) {
    event.preventDefault(); // Prevent default action of opening site.

    window.open("https://www.linkedin.com/in/alex-goley-6230479b/", "_blank");
  };
}

function onHugsButtonClick() {
  console.log("init hug");
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    triggerPushFromBackend().then((res) => console.log(res));

    const notification = new Notification("Hug Delivered!", MyNotification);
    addClickEvent(notification);
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        hugsButton.innerHTML = "FREE HUG 🤗";
        const notification = new Notification("Hug Delivered!", MyNotification);
        addClickEvent(notification);

        subscribeUserToPush().then((subscription) => {
          alert(JSON.stringify(subscription));
          sendSubscriptionToBackEnd(subscription).then((res) =>
            console.log(res),
          );
        });
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}
if (Notification.permission === "granted") {
  hugsButton.innerHTML = "FREE HUG 🤗";
}

hugsButton.addEventListener("click", onHugsButtonClick);

function subscribeUserToPush() {
  console.log("subscribe user...");
  return navigator.serviceWorker.ready
    .then((registration) => {
      console.log("service worker ready...");

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BJbRM93fg6KqHGFX6FB8PaDFkCASnKZLJCnteElGbu8vkqF5ksSstJB6X7hqR-9xYGYYGEZPyDSUYJiqwRhuYTQ",
        ),
      };
      console.log("creating subscription");

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then((pushSubscription) => {
      console.log(
        "Received PushSubscription: ",
        JSON.stringify(pushSubscription),
      );
      return pushSubscription;
    });
}

// Web-Push
// Public base64 to Uint
function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscriptionToBackEnd(subscription) {
  console.log("sending subscription...");
  return fetch(
    "https://alex-pwa-server-88f471dd113d.herokuapp.com/api/save-subscription/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    },
  )
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Bad status code from server.");
      }

      return response.json();
    })
    .then(function (responseData) {
      if (!(responseData.data && responseData.data.success)) {
        throw new Error("Bad response from server.");
      }
    });
}

function triggerPushFromBackend() {
  console.log("sending");
  return fetch(
    "https://alex-pwa-server-88f471dd113d.herokuapp.com/api/trigger-push-msg/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  )
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Bad status code from server.");
      }

      return response.json();
    })
    .then(function (responseData) {
      if (!(responseData.data && responseData.data.success)) {
        throw new Error("Bad response from server.");
      }
    });
}

function isMobile() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    return true;
  } else {
    return false;
  }
}
