var messageCount = 0;
const messageBox = document.getElementById("messageBox");
const messageBoxPlaceHolders = document.getElementById(
  "message-box-placeholders"
);
const inputBox = document.getElementById("inputBox");
const sendButton = document.getElementById("send-button");
const exampleModal = document.getElementById("example-modal");
const submitNameBtn = document.getElementById("submit-name-btn");
const customNameBox = document.getElementById("custom-name-box");
let userName = "Someone";
document.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && !exampleModal.classList.contains("show")) {
    sendMessage();
  }
  if (event.key == "`") {
    messageBox.scrollTop = messageBox.scrollHeight;
  }
});

function getCustomName() {
  if (customNameBox.value == "") {
    alert("name cannot be empty!");
  } else if (customNameBox.value.length > 10) {
    alert("name is too long!");
  } else {
    userName = customNameBox.value;
    userName = userName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    console.log("username set to", userName);
    socket.emit("name change", { userName });
  }
}

function sendHelpMessage() {
  console.log("sending help message");
  messageCount += 1;
  let helpMessage = serverHelpMessage;
  timeStamp = getTimeStamp();
  if (messageCount == 1 && messageBox.innerHTML.includes("placeholder")) {
    messageBox.innerHTML = "";
    appendNamelessMessage(timeStamp, helpMessage);
  } else {
    appendNamelessMessage(timeStamp, helpMessage);
  }
}

function sendMessage() {
  console.log("sending");
  let message = inputBox.value;
  // check for client-side commands
  if (/^(\/help)$/g.test(message)) {
    sendHelpMessage();
  } else if (message.length <= 500) {
    // if first time sending message, clear placeholder
    messageCount += 1;
    socket.emit("chat message", { userName, message, messageCount });
    inputBox.value = "";
  } else {
    alert("Message too long, cut crap!");
  }
  if (messageCount == 1 && messageBox.innerHTML.includes("placeholder")) {
    clearBoard();
  }
}

function appendMessage(data) {
  let _userName = data._userName;
  let _message = data._message;
  console.log("received message from server end");
  console.log(_userName, _message);
  let _choking_message = data._choking_message;

  if (_message == _choking_message) {
    if (_userName == userName) {
      _message = `<h1>*Gulp...*</h1> You suddenly choked on too much saliva. As you are busy wiping away your saliva, you overhear some murmurs mocking your lack of eloquence. Be careful, ${userName}! Promise me this is your last time.`;
    }
    timeStamp = getTimeStamp();
    appendNamelessMessage(timeStamp, _message);
  } else {
    prepareNonEmptyMessage(_userName, _message);
  }
}

function getTimeStamp() {
  datenow = new Date();
  let dtHour =
    datenow.getHours() < 10
      ? "0" + datenow.getHours().toString()
      : datenow.getHours();
  let dtMinute =
    datenow.getMinutes() < 10
      ? "0" + datenow.getMinutes().toString()
      : datenow.getMinutes();
  let timeStamp = `${dtHour}:${dtMinute}`;
  return timeStamp;
}

function appendNamelessMessage(timeStamp, _message) {
  if (
    messageBox.scrollTop + messageBox.clientHeight >=
    messageBox.scrollHeight
  ) {
    messageBox.innerHTML += `<span class="text-light"> [${timeStamp}] ${_message} </span>`;
    messageBox.scrollTop = messageBox.scrollHeight;
  } else {
    messageBox.innerHTML += `<span class="text-light"> [${timeStamp}] ${_message} </span>`;
  }
}

function appendIncomingMessage(timeStamp, _message) {
  if (
    messageBox.scrollTop + messageBox.clientHeight >=
    messageBox.scrollHeight
  ) {
    messageBox.innerHTML += `<span class="text-light"> [${timeStamp}] ${_userName} says: ${_message} </span>`;
    messageBox.scrollTop = messageBox.scrollHeight;
  } else {
    messageBox.innerHTML += `<span class="text-light"> [${timeStamp}] ${_userName} says: ${_message} </span>`;
  }
}

function prepareNonEmptyMessage(_userName, _message) {
  // sanitize message
  _message = _message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // look for commands
  if (/^(\/bigger )/g.test(_message)) {
    _message = _message.replace(/^(\/bigger)/g, "");
    _message = `<h1>${_message}</h1>`;
  }
  if (/(^\/rickroll)/g.test(_message)) {
    _message = _message.replace(
      /(\/rickroll)/g,
      '<img src="https://media.tenor.com/qRq-Dq-uA24AAAAM/rick-roll.gif" width="100px" height="100px" alt="have fun rick rolled"></img>'
    );
  }
  console.log(_message);

  // look up time stamp
  timeStamp = getTimeStamp();

  // attach time stamp to message and send
  appendIncomingMessage(timeStamp, _message);
}

socket.on("chat message", (data) => {
  _message = data._message;
  _userName = data._userName;
  _choking_message = data._choking_message;
  console.log(_message, _userName);
  appendMessage({ _userName, _message, _choking_message });
});

socket.emit(
  "send help message",
  console.log("asking help message from server")
);

socket.on("help message", (data) => {
  serverHelpMessage = data;
  console.log(data);
});

// send help message once client loaded
window.addEventListener(
  "DOMContentLoaded",
  function () {
    // do stuff
    socket.on("help message", (data) => {
      serverHelpMessage = data;
      messageBoxPlaceHolders.style.transition = "opacity 0.5s ease-out";
      messageBoxPlaceHolders.style.opacity = 0;
      this.setTimeout(sendHelpMessage, 500);
    });
  },
  false
);
