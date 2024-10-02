//PWAs can detect network status!!
function updateOnlineStatus(event) {
  let profileImg = document.getElementById("profileImg");
  if (profileImg) {
    let src = profileImg.src;

    profileImg.src = navigator.onLine
      ? src.replace("_offline", "")
      : src.replace(".jpg", "_offline.jpg");
  }
}
updateOnlineStatus();

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
