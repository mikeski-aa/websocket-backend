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
  // check vertical first
  const filteredX = room.board.filter((element) => element.marker == "X");
  const filteredO = room.board.filter((element) => element.marker == "O");

  let tempHolder = [];

  const vertCheckX = filteredX.filter((item) => item.x === 0);
  const horiCheckX = filteredX.filter((item) => item.y === 0);

  const vertCheckY = filteredO.filter((item) => item.x === 0);
  const horiCheckY = filteredO.filter((item) => item.y === 0);

  const diagCheckXOne = [];
  const diagCheckXTwo = [];

  // loop to check diags for X filter
  for (let k = 0; k < filteredX.length; k++) {
    if (
      (filteredX[k].x === 0 && filteredX[k].y === 0) ||
      (filteredX[k].x === 1 && filteredX[k].y === 1) ||
      (filteredX[k].x === 2 && filteredX[k].y === 2)
    ) {
      diagCheckXOne.push(filteredX[k]);
    }
  }

  for (let k = 0; k < filteredX.length; k++) {
    if (
      (filteredX[k].x === 0 && filteredX[k].y === 2) ||
      (filteredX[k].x === 1 && filteredX[k].y === 1) ||
      (filteredX[k].x === 2 && filteredX[k].y === 0)
    ) {
      diagCheckXTwo.push(filteredX[k]);
    }
  }

  const diagCheckOOne = [];
  const diagCheckOTwo = [];

  // loop to check diag for O
  for (let k = 0; k < filteredO.length; k++) {
    if (
      (filteredO[k].x === 0 && filteredO[k].y === 0) ||
      (filteredO[k].x === 1 && filteredO[k].y === 1) ||
      (filteredO[k].x === 2 && filteredO[k].y === 2)
    ) {
      diagCheckOOne.push(filteredX[k]);
    }
  }

  for (let k = 0; k < filteredO.length; k++) {
    if (
      (filteredO[k].x === 0 && filteredO[k].y === 2) ||
      (filteredO[k].x === 1 && filteredO[k].y === 1) ||
      (filteredO[k].x === 2 && filteredO[k].y === 0)
    ) {
      diagCheckOTwo.push(filteredX[k]);
    }
  }

  if (
    vertCheckX.length === 3 ||
    horiCheckX.length === 3 ||
    vertCheckY.length === 3 ||
    horiCheckY.length === 3 ||
    diagCheckXOne.length === 3 ||
    diagCheckXTwo.length === 3 ||
    diagCheckOOne.length === 3 ||
    diagCheckOTwo.length === 3
  ) {
    console.log("winner found");
  } else {
    console.log("no winner");
  }
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
