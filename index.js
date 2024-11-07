import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

const __dirname = dirname(fileURLToPath(import.meta.url));

// cors setup
const corsOptions = {
  origin: ["http://localhost:5173"],
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  //   res.sendFile(join(__dirname, "index.html"));
});

app.get("/test", (req, res) => {
  res.json("Hey");
});

let connectedUsers = [];

io.on("connection", (socket) => {
  // logs a user has connected to socket
  console.log("A user connected");
  connectedUsers.push(socket.id);

  // emits list of users to NEW USER
  socket.emit("users", connectedUsers);

  // emits list of users to all users
  io.emit("users", connectedUsers);

  console.log("Connected users: " + connectedUsers);
  // console logs sent message
  // this prints the message in console when incoming
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });

  // emit message back to all users connected
  // this does stuff on the server side frontend
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  // informs of a user disconnecting
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    connectedUsers = connectedUsers.filter((user) => user != socket.id);
    // emits list to all users, except user
    io.emit("users", connectedUsers);
    console.log("Connected users: " + connectedUsers);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
