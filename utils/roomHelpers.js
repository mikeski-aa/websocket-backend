import { v4 as uuidv4 } from "uuid";
import { genBoard } from "./genBoard.js";

function roomCheck(socket, roomArray, io) {
  console.log(roomArray);

  // if room array is zero we create new room directly
  if (roomArray.length == 0) {
    const newRooms = [createRoom(socket, roomArray)];

    return newRooms;
  }

  // filters the rooms array
  // returns only rooms that have no second person
  let filteredArray = roomArray.filter((item) => item.users.length < 2);
  // need to check if filtered array has items
  // person joins room.
  // now we need to update the array to reflect the join.
  if (filteredArray.length > 0) {
    socket.join(filteredArray[0].roomId);
    filteredArray[0].users.push(socket.id);

    // inform both users that the other user has joined
    // pass X or Y to parties too
    // begin the game
    beginGame(io, socket, filteredArray);
    return roomArray;
  } else {
    // we create a new room
    const newRooms = createRoom(socket, roomArray);
    roomArray.push(newRooms);
    return roomArray;
  }
}

// socket joins room generated.
function createRoom(socket) {
  const room = uuidv4();
  socket.join(room);

  const infoObject = {
    roomId: room,
    users: [socket.id],
    board: genBoard(),
  };

  return infoObject;
}

function generateXYmarkers() {
  const number = Math.round(Math.random());

  if (number === 0) {
    return { one: "X", two: "O" };
  } else {
    return { one: "O", two: "X" };
  }
}

function generatePlayerQueue(idOne, idTwo) {
  const number = Math.round(Math.random());
  const moveQueue = [];

  if (number === 0) {
    for (let x = 0; x < 9; x++) {
      if (x % 2 === 0) {
        moveQueue.push(idOne);
      } else {
        moveQueue.push(idTwo);
      }
    }

    return moveQueue;
  } else {
    for (let x = 0; x < 9; x++) {
      if (x % 2 === 1) {
        moveQueue.push(idOne);
      } else {
        moveQueue.push(idTwo);
      }
    }
    return moveQueue;
  }
}

function beginGame(io, socket, filteredArray) {
  const markerObject = generateXYmarkers();
  const otherSocket = io.sockets.sockets.get(filteredArray[0].users[0]);
  const moveOrder = generatePlayerQueue(socket.id, otherSocket.id);

  // emit player markers to two players in the room
  socket.emit("playerMarker", markerObject.one);
  otherSocket.emit("playerMarker", markerObject.two);

  // emit board status to both parties
  // in order to do that we need to broadcast on io instead of individual socket!
  io.to(filteredArray[0].roomId).emit("initialBoard", filteredArray[0].board);

  // inform frontend that both members joined and room is full
  io.to(filteredArray[0].roomId).emit("user join", "user joined room");
}

export { roomCheck };
