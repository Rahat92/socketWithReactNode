const { Server } = require("socket.io");
const server = require("./app");

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
