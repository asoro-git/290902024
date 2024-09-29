var messageCount = 0;
const messageBox = document.getElementById("messageBox");
const inputBox = document.getElementById("inputBox");
const sendButton = document.getElementById("send-button");

document.addEventListener("keydown", (event) => {
  if (event.keyCode == 13) {
    sendMessage();
  }
});

function clearBoard() {
  messageBox.innerHTML = "";
}

function sendMessage() {
  console.log("sending");
  let message = inputBox.value;
  // if first time sending message, clear placeholder
  if (message) {
    messageCount += 1;
  }
  if (messageCount >= 1 && messageBox.innerHTML.includes("placeholder")) {
    clearBoard();
  }

  socket.emit("chat message", { message, messageCount });
  inputBox.value = "";
}

function appendMessage(message) {
  console.log("received message from server end");
  message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (/^(\/bigger)/g.test(message)) {
    message = message.replace(/^(\/bigger)/g, "");
    message = `<h1>${message}</h1>`;
  }
  console.log(message);
  let timestamp = Date();
  messageBox.innerHTML += `<span> [${timestamp}] Someone says: ${message} </span>`;
}

socket.on("chat message", (message) => appendMessage(message));
