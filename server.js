import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { roomCheck, roomExtractor } from "./utils/roomHelpers.js";
import {
  disableMoveForCurrentSocket,
  enableMoveForNext,
  gameOverSend,
  moveCheck,
  moveQueueUp,
  sendNewBoard,
  winCheck,
} from "./utils/gameLogic.js";
import "dotenv/config";
import { apiRouter } from "./routes/apiRouter.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.LOCAL_URL, process.env.NONLOCAL_URL],
    methods: ["GET", "POST"],
  },
});

// parsing json bodies
app.use(express.json());

// cors setup
const corsOptions = {
  origin: [process.env.LOCAL_URL, process.env.NONLOCAL_URL],
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// for API routing
app.use("/api", apiRouter);

// we do it in memory for now
let connectedUsers = [];
let roomInfo = [];
let userid;

io.on("connection", (socket) => {
  // logs a user has connected to socket
  console.log("A user connected");
  connectedUsers.push(socket.id);

  // user info being sent across see how we recieve it:
  socket.on("userInfo", (item) => {
    console.log("connected user id searching confirmed: ");
    console.log(item);
    let idData;
    if (item == null) {
      idData = -1;
    } else {
      idData = item;
    }

    roomInfo = roomCheck(socket, roomInfo, io, idData);
  });

  // when a new user connects we assign them to a game room.

  console.log(roomInfo);
  // reset userid to crazy value

  // Log active rooms when a new user connects
  logActiveRooms(io);

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

  // handle handle incoming user click
  // need to validate the coordinates are:
  // 0. Extract correct room info
  // 1. game isnt over
  // 2. coordiantes are free
  // 3. send updated board to all users
  socket.on("userMove", (coordinates) => {
    const room = roomExtractor(roomInfo, socket.id);
    const check = moveCheck(room, coordinates);
    const isOver = winCheck(room);

    if (isOver) {
      sendNewBoard(room, io);
      gameOverSend(room, socket, io);
    } else {
      // if no winner, and only one item in queue left, means this is a draw
      if (room.moveQueue.length === 1) {
        io.to(room.roomId).emit("firstMove", false);
        io.to(room.roomId).emit("gameDraw", true);
      }

      if (check) {
        disableMoveForCurrentSocket(socket);
        moveQueueUp(room);
        enableMoveForNext(room, io);
        sendNewBoard(room, io);
      }
    }
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
    // henc we go through find the other room participant and disconnect him too
    if (found) {
      found.users.forEach((element) => {
        if (element != socket.id) {
          const foundSocket = io.sockets.sockets.get(element);
          foundSocket.leave(found.roomId);
          foundSocket.emit("handleDisconnectLoss", found.userids);
          foundSocket.emit("player disconnect", true);
        }
      });

      roomInfo = roomInfo.filter((item) => item.roomId != found.roomId);
    }

    socket.emit("rooms", roomInfo);
    // Log active rooms when a new user disconnects
    logActiveRooms(io);
  });
});

// logging function
function logActiveRooms(io) {
  console.log("Active rooms:");
  io.sockets.adapter.rooms.forEach((sockets, roomId) => {
    console.log(`Room: ${roomId} - Members: [${[...sockets].join(", ")}]`);
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port 3000");
});
