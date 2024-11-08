import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";
import { roomCheck } from "./utils/roomHelpers.js";
import { execPath } from "node:process";

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

// we do it in memory for now
let connectedUsers = [];

// room structure:
// roomid
// user one id
// user two id

let roomInfo = [];

io.on("connection", (socket) => {
  const logActiveRooms = () => {
    console.log("Active rooms:");
    io.sockets.adapter.rooms.forEach((sockets, roomId) => {
      console.log(`Room: ${roomId} - Members: [${[...sockets].join(", ")}]`);
    });
  };

  // logs a user has connected to socket
  console.log("A user connected");
  connectedUsers.push(socket.id);

  // if there are multiple users log information
  roomInfo = roomCheck(socket, roomInfo);
  console.log("///////////////////////////");
  console.log(roomInfo);
  console.log("///////////////////////////");

  // Log active rooms when a new user connects
  logActiveRooms();

  // emit rooms
  io.emit("rooms", roomInfo);

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
  // upon disconnecting, the socket will automatically leave all connected rooms all I need to do is update the logic
  // but we need to disconnect the other socket if it exists!
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    connectedUsers = connectedUsers.filter((user) => user != socket.id);
    // emits list to all users, except user
    io.emit("users", connectedUsers);
    console.log("Connected users: " + connectedUsers);

    // console.log(socket.id);

    const found = roomInfo.find((element) => element.users.includes(socket.id));

    // on one person disconnecting, the room will be closed.
    if (found) {
      found.users.forEach((element) => {
        if (element != socket.id) {
          const foundSocket = io.sockets.sockets.get(element);
          foundSocket.leave(found.roomId);
          foundSocket.emit("warning", `Room is being closed! ${found.roomId}`);
          // foundSocket.disconnect();
        }
      });

      roomInfo = roomInfo.filter((item) => item.roomId != found.roomId);
    }

    socket.emit("rooms", roomInfo);
    console.log("////////");
    console.log("room after delete: ");
    console.log(roomInfo);

    // Log active rooms when a new user connects
    logActiveRooms();
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
