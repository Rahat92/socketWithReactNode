const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);
  socket.on("send_message", (msg) => {
    console.log(msg);
    // socket.broadcast.emit("receive_message", msg);
    io.emit("receive_message", msg);
  });
});

server.listen(3001, () => {
  console.log("server is running on port 3001");
});
