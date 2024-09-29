const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const socketio = require("socket.io");
const mongoose = require("mongoose");

app.use("/static", express.static("static"));

//connect to mongoose

// start a http server
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/sidebar", (req, res) => {
  res.sendFile(path.join(__dirname, "sidebar.html"));
});

app.get("/roadmap", (req, res) => {
  res.sendFile(path.join(__dirname, "roadmap.html"));
});

// //io receive signal from frontend
// io.on("connection", console.log("socket connected!"));
// //io emit data to frontend

const PORT = process.env.PORT || 3000; // Fallback to 3000 for local dev
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
