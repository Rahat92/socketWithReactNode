const express = require("express");
const mongoose = require("mongoose");
const Message = require("./model/messageModel");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
mongoose
  .connect("mongodb://127.0.0.1:27017/message", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/api/v1/messages", async (req, res) => {
  const { message } = req.body;
  console.log(message);
  try {
    const newMessage = await Messege.create({ message });
    res.status(201).json({
      status: "success",
      data: {
        message: newMessage,
      },
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/", (req, res) => {
  res.send("hello world");
});
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// app.use("/api/v1/messages", messageRouter);
io.on("connection", async (socket) => {
  console.log(`user connected: ${socket.id}`);
  const messages = await Message.find();
  io.emit("receive_message", messages);
  socket.on("send_message", async (msg) => {
    await Message.create({ message: msg.message, name: msg.name });
    const allMessage = await Message.find();
    console.log(allMessage);
    socket.broadcast.emit("receive_message", allMessage);
    console.log(msg.time);
    setInterval(() => {
      const adminTime = msg.time;
      const date = new Date();
      const time = date.getHours() + ":" + date.getMinutes();
      if (adminTime == time) {
        console.log(64, adminTime, time);
        console.log("Hello world how are you");
        // io.emit("start_video", date.toLocaleTimeString());
        io.emit(
          "start_video",
          "ভিডিও চালু হয়েছেঃও " + date.toLocaleTimeString()
        );
      }
      // console.log(time)
    }, 1000);
    // io.emit("receive_message", allMessage);
  });
});

server.listen(3001, () => {
  console.log("server is running on port 3001");
});

module.exports = app;
