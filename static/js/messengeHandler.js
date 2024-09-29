var messageCount = 0;
const messageBox = document.getElementById("messageBox");
const inputBox = document.getElementById("inputBox");
const sendButton = document.getElementById("send-button");
const exampleModal = document.getElementById("example-modal");
const customNameBox = document.getElementById("custom-name-box");
let userName = "Someone";
document.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && !exampleModal.classList.contains("show")) {
    sendMessage();
  }
});

function getCustomName() {
  userName = customNameBox.value;
  userName = userName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  console.log("username set to", userName);
}

function clearBoard() {
  messageBox.innerHTML = "";
}

function sendHelpMessage() {
  console.log("sending help message");
}

function sendMessage() {
  console.log("sending");
  let message = inputBox.value;
  // if first time sending message, clear placeholder
  if (message) {
    messageCount += 1;
  }
  if (messageCount <= 1 && messageBox.innerHTML.includes("placeholder")) {
    clearBoard();
  }

  socket.emit("chat message", { userName, message, messageCount });
  inputBox.value = "";
}

function appendMessage(data) {
  let _userName = data._userName;
  let _message = data._message;
  console.log("received message from server end");
  console.log(_userName, _message);
  _message = _message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (/^(\/bigger )/g.test(_message)) {
    _message = message.replace(/^(\/bigger)/g, "");
    _message = `<h1>${_message}</h1>`;
  }
  console.log(_message);
  datenow = new Date();
  let timeStamp = `${datenow.getHours()}:${datenow.getMinutes()}`;
  if (
    messageBox.scrollTop + messageBox.clientHeight >=
    messageBox.scrollHeight
  ) {
    console.log(
      "messageBox.scrollTop + messageBox.clientHeight >=messageBox.scrollHeight"
    );
    messageBox.innerHTML += `<span> [${timeStamp}] ${userName} says: ${_message} </span>`;
    messageBox.scrollTop = messageBox.scrollHeight;
  } else {
    messageBox.innerHTML += `<span> [${timeStamp}] ${userName} says: ${_message} </span>`;
  }
}

socket.on("chat message", (data) => {
  _message = data._message;
  _userName = data._userName;
  console.log(_message, _userName);
  appendMessage({ _userName, _message });
});
