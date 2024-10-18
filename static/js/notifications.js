//The spec: https://notifications.spec.whatwg.org/
const MyNotification = {
  body: "This is getting personal! Lets connect 😆",
  icon: "static/img/linkedin-secondary-136x136.png",
  //Doesnt work on Apple!
  image: "static/img/icons/icon-384x384.png",
  //Sound is not supported... YET
  //   sound: "/static/sounds/BOTW_Fanfare_HeartContainer.wav",
  //Keeps the notification displayed
  requireInteraction: false,
  //dont play a sound
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

function sendToLinkedIn(notification) {
  notification.onclick = function (event) {
    event.preventDefault(); // Prevent default action of opening site.

    window.open("https://www.linkedin.com/in/alex-goley-6230479b/", "_blank");
  };
}

function notifyVisitor() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification("Hug Delivered!", MyNotification);
    sendToLinkedIn(notification);
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        hugsButton.innerHTML = "FREE HUG 🤗";
        const notification = new Notification("Hug Delivered!", MyNotification);
        sendToLinkedIn(notification);

        subscribeUserToPush();
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}
if (Notification.permission === "granted") {
  hugsButton.innerHTML = "FREE HUG 🤗";
}

hugsButton.addEventListener("click", notifyVisitor);

function subscribeUserToPush() {
  return navigator.serviceWorker.ready
    .then(function (registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BJbRM93fg6KqHGFX6FB8PaDFkCASnKZLJCnteElGbu8vkqF5ksSstJB6X7hqR-9xYGYYGEZPyDSUYJiqwRhuYTQ",
        ),
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function (pushSubscription) {
      console.log(
        "Received PushSubscription: ",
        JSON.stringify(pushSubscription),
      );
      return pushSubscription;
    });
}
