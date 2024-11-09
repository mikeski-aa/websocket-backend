// function checks whether the marker clicked was indeed empty.
// if it was empty, set the current marker and return true (this will allow function to continue)
// else we return false
function moveCheck(room, sentItem) {
  console.log(room);
  console.log(sentItem);

  const element = room.board.find(
    (element) =>
      element.x === sentItem.coords[0] && element.y === sentItem.coords[1]
  );
  console.log("element found!");
  console.log(element);

  if (element.marker === "") {
    element.marker = sentItem.playerMarker;
    return true;
  } else {
    return false;
  }
}

// disable move option for first item
function disableMoveForCurrentSocket(socket) {
  socket.emit("firstMove", false);
}

// use array.splice method to remove first element
function moveQueueUp(room) {
  room.moveQueue.splice(0, 1);
}

// this will crash on 9th move fix it
function enableMoveForNext(room, io) {
  const nextSocket = io.sockets.sockets.get(room.moveQueue[0]);

  nextSocket.emit("firstMove", true);
}

// send updated board to be rendered by both parties
function sendNewBoard(room, io) {
  io.to(room.roomId).emit("initialBoard", room.board);
}

// check for win condition
// diagonal, horizontal, vertical
// vert
// [0, 0], [0, 1], [0, 2]
// [1, 0], [1, 1], [1, 2]
// [2, 0], [2, 1], [2, 2]
// horiz
// [0, 0], [1, 0], [2, 0]
// [0, 1], [1, 1], [2, 1]
// [0, 2], [1, 2], [2, 2]
// diag
// [0, 0], [1, 1], [2, 2]
// [0, 2], [1, 1], [2, 0]
function winCheck(room) {
  // refactor
  const markers = ["X", "O"];

  const checkDiag = (array) => {
    const diagEquals = array.filter((item) => item.x === item.y);
    const diagTwo = array.filter((item) => item.x + item.y === 2);

    return diagEquals.length === 3 || diagTwo.length === 3;
  };

  const checkHV = (array) => {
    const verticalFilter = array.filter((element) => element.x === 0);
    const horizontalFilter = array.filter((element) => element.y === 0);

    return verticalFilter.length === 3 || horizontalFilter.length === 3;
  };

  markers.forEach((marker) => {
    const filteredItems = room.board.filter(
      (element) => element.marker == marker
    );

    if (checkHV(filteredItems) || checkDiag(filteredItems)) {
      console.log("winner found " + marker);
    } else {
      console.log("no winner");
    }
  });
}

export {
  moveCheck,
  disableMoveForCurrentSocket,
  moveQueueUp,
  enableMoveForNext,
  sendNewBoard,
  winCheck,
};

let board = [
  { x: 0, y: 0, marker: "X" },
  { x: 1, y: 0, marker: "X" },
  { x: 2, y: 0, marker: "O" },
  { x: 0, y: 1, marker: "O" },
  { x: 1, y: 1, marker: "O" },
  { x: 2, y: 1, marker: "" },
  { x: 0, y: 2, marker: "O" },
  { x: 1, y: 2, marker: "O" },
  { x: 2, y: 2, marker: "" },
];

let room = {
  board: board,
};

winCheck(room);
