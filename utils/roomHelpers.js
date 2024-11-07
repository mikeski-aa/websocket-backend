import { v4 as uuidv4 } from "uuid";

function roomCheck(socket, roomArray) {
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
  };

  return infoObject;
}

export { roomCheck };
