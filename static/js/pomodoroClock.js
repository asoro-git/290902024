const timeInputBox = document.getElementById("time-input-box");
const pomodoroClock = document.getElementById("pomodoro-clock");
const startPmdClk = document.getElementById("start-pomodoro-clock");
const setPmdClk = document.getElementById("set-pomodoro-clock");
const pstModal = document.getElementById("pomodoro-set-timer-modal");
let notificationState = false;
let pomodoroSetter = 25;
let secondTimer = 60;
let minuteLeft = 24;

function notifyMe(message) {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification(message);
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(message);
        // …
      }
    });
  }
}

function setPomodoroTime() {
  pomodoroSetter = timeInputBox.value;
  if (pomodoroSetter >= 60) {
    alert("Try something less than 60 minutes to avoid burn out");
  } else if (pomodoroSetter < 5) {
    alert("Try at least 5 minutes");
  } else {
    console.log(timeInputBox.value);
    minuteLeft = pomodoroSetter - 1;
    pomodoroClock.innerText =
      pomodoroSetter +
      ":" +
      (secondTimer % 60 < 10 ? 0 : "") +
      (secondTimer % 60);
  }
}

function updateClock(m, s) {
  pomodoroClock.innerText =
    (m < 10 ? "0" + m : m) + ":" + (s % 60 < 10 ? 0 : "") + (s % 60);
  console.log(m + ":" + (s % 60 < 10 ? 0 : "") + (s % 60));
}

function countDownPmd() {
  startPmdClk.classList.add("disabled");
  setPmdClk.classList.add("disabled");
  if (notificationState == false) {
    notifyMe("Session starts");
    notificationState = true;
  }

  if (secondTimer > 0) {
    secondTimer -= 1;
    if (fightingState == false) {
      fightingRounds(player, 1);
      i += 1;
    }
    updateClock(minuteLeft, secondTimer);
    setTimeout(countDownPmd, 1000);
  } else if (minuteLeft > 0) {
    minuteLeft -= 1;
    secondTimer = 59;
    updateClock(minuteLeft, secondTimer);
    setTimeout(countDownPmd, 1000);
  } else {
    notifyMe("Time is up!");

    startPmdClk.classList.remove("disabled");
    setPmdClk.classList.remove("disabled");
    notificationState = false;
    // server validation
  }
}

document.addEventListener("keyup", function (event) {
  if (event.key == "Enter" && pstModal.classList.contains("show")) {
    document.getElementById("submit-timer-btn").click();
  }
});
