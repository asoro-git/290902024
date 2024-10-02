//require all the packages, call using constName.function(var)
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

//testing port
const port = 3000;

// start a http server
const app = express();
const server = http.createServer(app);

// send server details to socketIo and establish socket server
const io = socketIo(server);

// connect to mongoose
const mongoose = require("mongoose");
const { hostname } = require("os");

app.use("/static", express.static("static"));

// express serves files to front end, front end file should contain socket.js and const socket = io()
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/sidebar", (req, res) => {
  res.sendFile(path.join(__dirname, "sidebar.html"));
});

app.get("/roadmap", (req, res) => {
  res.sendFile(path.join(__dirname, "roadmap.html"));
});

app.get("/pomodoro", (req, res) => {
  res.sendFile(path.join(__dirname, "pomodoro.html"));
});

let playerCount = 0;
let userName = "Someone";
let existingPlayerId = [];

// after serving files to front end, io start listening to message sent from front end
// console log if mutual channel has been established
// io receive signal from frontend, create connection and disconnection messages
io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected.`);

  const userId = socket.id;
  existingPlayerId.push(userId);
  playerCount += 1;
  console.log(existingPlayerId, playerCount);
  userName = "Burst Linker " + socket.id.toString().substring(0, 5);
  _userName = userName;
  io.emit("online players", { playerCount });
  io.emit("player list", { userName, userId, existingPlayerId });
  socket.on("name change", (data) => {
    let userName = data.userName;
    console.log("sever received name change event", userName);
    io.emit("player list", { userName, userId });
    console.log("server emitted name change", data);
  });
  socket.on("chat message", (data) => {
    let _userName = data.userName;
    let _message = data.message;
    let _choking_message = `<h1>*Gulp...*</h1> ${_userName} suddenly choked on their own saliva. You hear some murmurs, mocking ${_userName}'s lack of eloquence. Be careful, ${_userName}! Promise me this is your last time.`;
    if (_message == "") {
      _message = _choking_message;
    }
    console.log(data.userName, data.message, data.messageCount);
    io.emit("chat message", { _userName, _message, _choking_message });
  });
  socket.onAny((event, ...args) => {
    const logMessage = `Client: ${
      socket.id
    }, Event: ${event}, Args: ${JSON.stringify(args)}\n`;
    console.log(logMessage);
  });
  socket.on("send help message", () => {
    socket.emit(
      "help message",
      `
      </span>
      <div class="container" style="width: 100%">
      <center>
      <h1> HELP MENU </h1>
      <br>Below are commands available at the moment 
      <br>
      <table>
      <td>
      <li>/bigger to make your text bigger</li>
      <li>press the \` key on keyboard to scroll to bottom of chat</li>
      <li>Change name using navbar dropdown menu</li>
      <li>in-chat help function, type /help into chat to look at this page again</li>
      </ul>
      <br><strong>Features to be added</strong>
      <ul>
      <li>login page</li>
      <li>pomodoro clock</li>
      <li>offline hunting</li>
      <li>idle leveling</li>
      <li>profile page</li>
      <li>adventure page</li>
      <li>inventory</li>
      <li>move alert logics to server side when possible</li>
      <li>server authenticate socket events</li>
      <li>weather system based on server world time</li>
      <li>server/ world time system</li>
      <li>and more... please stay tunned...</li>
      </ul>
      <ul><strong>Road Map</strong>
      <li>Vanilla JS Program</li>
      <li>?Nextjs/ EJS Framework</li>
      <li>React rebuild</li>
      </ul>
      </td>
      </table>
      </div>
      </center>
      <span>
      `
    );
  });

  console.log(playerCount);
  socket.on("disconnect", () => {
    let __userId = socket.id;
    console.log(__userId);
    console.log(`user ${__userId} has disconnected.`);
    playerCount -= 1;
    io.emit("online players", { playerCount });
    io.emit("disconnected player", { __userId });
    console.log(__userId);
    existingPlayerId = existingPlayerId.filter(
      (item) => item != __userId.toString()
    );
    console.log(existingPlayerId, playerCount);
  });
});

// //io emit data to frontend

const PORT = process.env.PORT || 3000; // Fallback to 3000 for local dev
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
