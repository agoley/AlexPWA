//The spec: https://notifications.spec.whatwg.org/
const MyNotification = {
  body: "Check out where I'll be speaking next",
  icon: "/static/img/icons/icon-384x384.png",
  //Doesnt work on Apple!
  image: "/static/img/speaking.jpg",
  //Sound is not supported... YET
  sound: "/static/sounds/BOTW_Fanfare_HeartContainer.wav",
  click_action: "/speaking.html",
  //Keeps the notification displayed
  requireInteraction: false,
  //dont play a sound
  silent: false,
  // Vibration: Star Wars shamelessly taken from the awesome Peter Beverloo
  // https://tests.peter.sh/notification-generator/
  vibrate: [
    500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170,
    40, 500,
  ],
  //Unique identifier for this notification
  tag: "unique-identifier",
};

function displayNotification() {
  Notification.requestPermission().then(function (result) {
    console.log(result); // granted!
    new Notification("Permission Granted!", MyNotification);
  });
}

const button = document.getElementById("notifyMe");
const notifyOn = Notification.permission === "granted";

if (button) {
  button.addEventListener("click", (e) => {
    console.log(Notification.permission);
    if (notifyOn) {
      displayNotification();
    } else {
      //Can't turn off notifications via JS - need to do this in Chrome
    }
  });
}
