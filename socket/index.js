const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const express = require("express")

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Listening for messages
  socket.on("sendMessage", (data) => {
    const { receiverId, message } = data;
    io.emit("getMessage", data); // Send message to all connected clients

    // Optionally, you can add logic to emit messages to specific rooms/users.
    // socket.to(receiverId).emit("getMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(8900, () => {
  console.log("Socket server running on port 8900");
});
