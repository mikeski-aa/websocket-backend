import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

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
    beginGame(io, socket, filteredArray);
    return roomArray;
  } else {
    // we create a new room
    const newRooms = createRoom(socket, roomArray);
    roomArray.push(newRooms);
    return roomArray;
  }
}

function createRoom(socket, roomArray) {
  const room = uuidv4();
  socket.join(room);
  const infoObject = {
    roomId: room,
    users: [socket.id],
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
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

function beginGame(io, socket, filteredArray) {
  const markerObject = generateXYmarkers();
  const otherSocket = io.sockets.sockets.get(filteredArray[0].users[0]);
  socket.to(filteredArray[0].roomId).emit("user join", "user joined room");
  socket.emit("playerMarker", markerObject.one);

  otherSocket.to(filteredArray[0].roomId).emit("user join", "user joined room");
  otherSocket.emit("playerMarker", markerObject.two);
}

export { roomCheck };
