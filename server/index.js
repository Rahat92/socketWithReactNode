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
  // io.emit("start_video", messages[0].message);
    const special = await Message.find({name:'admin'});
    io.emit("start_video", special[0]?.message);
  socket.on("send_message", async (msg) => {
    await Message.create({ message: msg.message, name: msg.name });
    const allMessage = await Message.find();
    console.log(allMessage);
    socket.emit("receive_message", allMessage);

    console.log(58, msg.time);
    const myTime = new Date(msg.time);
    console.log(60, myTime);
    console.log(myTime - Date.now());
    setTimeout(async() => {
      await Message.create({ name: 'admin', message: 'I am admin' })
      
      io.emit("start_video", 'I am admin');
    }, myTime - Date.now());
  });
});

server.listen(3001, () => {
  console.log("server is running on port 3001");
});

module.exports = app;
