import { v4 as uuidv4 } from "uuid";

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
