const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const socketio = require("socket.io");

app.use("/static", express.static("static"));

// start a http server
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend.html"));
});

app.get("/sidebar", (req, res) => {
  res.sendFile(path.join(__dirname, "sidebar.html"));
});

app.get("/roadmap", (req, res) => {
  res.sendFile(path.join(__dirname, "roadmap.html"));
});

//io receive signal from frontend
//io emit data to frontend

server.listen(port, () => console.log("server listening on port 3000"));
