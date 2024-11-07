import { v4 as uuidv4 } from "uuid";

function roomCheck(socket, roomArray) {
  console.log(roomArray);

  // if room array is zero we create new room directly
  if (roomArray.length == 0) {
    const newRooms = createRoom(socket, roomArray);

    return newRooms;
  }

  // filters the rooms array
  // returns only rooms that have no second person
  let filteredArray = roomArray.filter((item) => item.users.length != 2);
  // need to check if filtered array has items
  // person joins room.
  // now we need to update the array to reflect the join.
  if (filteredArray.length > 0) {
    socket.join(filteredArray[0].roomId);
    filteredArray.map((item) => {
      if (item.roomId == filteredArray[0].roomId) {
        item.users.push(socket.id);
      }
    });

    const newRooms = roomArray.map((item) => {
      if (item.roomId === filteredArray[0].roomId) {
        item = filteredArray[0];
      }
    });

    return newRooms;
  } else {
    // we create a new room
    const room = uuidv4();
    const newRooms = createRoom(socket, roomArray);

    return newRooms;
  }
}

function createRoom(socket, roomArray) {
  const room = uuidv4();
  socket.join(room);
  const infoObject = {
    roomId: room,
    users: [socket.id],
  };
  const newRooms = roomArray.push(infoObject);

  return newRooms;
}

export { roomCheck };

let testArr = [
  {
    roomId: "asxax123DSADzj",
    users: ["userid1", "userid2"],
  },
  {
    roomId: "asxax123DSADSzzzzDzj",
    users: ["userid1"],
  },
];

function testFunc(testArr) {
  let tempArray = [];
  testArr.map((item) => tempArray.push(item));

  console.log(testArr);
  if (testArr.length == 0) {
    const room = uuidv4();
    const infoObject = {
      roomId: room,
      users: [uuidv4()],
    };

    const newRooms = tempArray.push(infoObject);
    console.log(newRooms);
    return newRooms;
  }
}

testArr = testFunc(testArr);

console.log(testArr);
