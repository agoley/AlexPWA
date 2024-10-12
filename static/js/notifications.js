//The spec: https://notifications.spec.whatwg.org/
const MyNotification = {
  body: "This is getting personal! Say hello :)",
  icon: "static/img/icons/icon-384x384.png",
  //Doesnt work on Apple!
  image: "/static/img/e-mail-symbol",
  //Sound is not supported... YET
  //   sound: "/static/sounds/BOTW_Fanfare_HeartContainer.wav",
  click_action: "/",
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

function notifyMe() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    new Notification("Permission Granted!", MyNotification);
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        new Notification("Permission Granted!", MyNotification);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}

const button = document.getElementById("notifyMe");

button.addEventListener("click", notifyMe);
