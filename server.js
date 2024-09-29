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

// after serving files to front end, io start listening to message sent from front end
// console log if mutual channel has been established
// io receive signal from frontend, create connection and disconnection messages
io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected.`);
  socket.on("chat message", (data) => {
    let _userName = data.userName;
    let _message = data.message;
    let _choking_message = `<h1>*Gulp...*</h1> ${_userName} suddenly choked on too much saliva. You hear some murmurs, mocking ${_userName}'s lack of eloquence. Be careful, ${_userName}! Promise me this is your last time.`;
    if (_message == "") {
      _message = _choking_message;
    }
    console.log(data.userName, data.message, data.messageCount);
    io.emit("chat message", { _userName, _message, _choking_message });
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
      <li>Change name using navbar dropdown menu</li>
      <li>in-chat help function, type /help into chat to look at this page again</li>
      </ul>
      <br><strong>features to be added</strong>
      <ul>
      <li>login page</li>
      <li>profile page</li>
      <li>adventure page</li>
      </li>inventory</li>
      <li>and more..., please stay tunned...</li>
      </ul>
      </td>
      </table>
      </div>
      </center>
      <span>
      `
    );
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} has disconnected.`);
  });
});

// //io emit data to frontend

const PORT = process.env.PORT || 3000; // Fallback to 3000 for local dev
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
