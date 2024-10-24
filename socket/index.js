const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const express = require("express");
let forexPairs = require("./dummy");

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

setInterval(() => {
  const timestamp = new Date().toISOString();
  forexPairs = forexPairs.map(currency => ({
    ...currency,
    bid: (parseFloat(currency.bid) + (Math.random() - 0.5) * 0.01).toFixed(4),
    ask: (parseFloat(currency.ask) + (Math.random() - 0.5) * 0.01).toFixed(4),
    timestamp
  }));
  io.emit("forexUpdate", forexPairs);
}, 1000);

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.emit("forexUpdate", forexPairs);

  socket.on("sendMessage", (data) => {
    const { receiverId, message } = data;
    io.emit("getMessage", data);

  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(8900, () => {
  console.log("Socket server running on port 8900");
});
