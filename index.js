import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  // logs a user has connected to socket
  console.log("A user connected");

  // console logs sent message
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });

  // emit message back to all users connected
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  // informs of a user disconnecting
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});