import { v4 as uuidv4 } from "uuid";

let testArr = [
  {
    roomId: "asxax123DSADzj",
    users: ["userid1", "userid2"],
  },
  {
    roomId: "asxax123DSADSzzzzDzj",
    users: ["userid1", "uuasda3"],
  },
  {
    roomId: "asxax123a3DSADSzzzzDzj",
    users: ["useri3d1"],
  },
  {
    roomId: "asxax122z3DSADSzzzzDzj",
    users: ["userids1", "uuasd3a3"],
  },
];

let newArr = [];

function testFunc(testArr) {
  console.log(testArr);

  if (testArr.length === 0) {
    console.log("zero length detected");
    const room = uuidv4();
    const infoObject = {
      roomId: room,
      users: [uuidv4()],
    };

    const xArr = [infoObject];

    return xArr;
  } else {
    console.log("array has items in it");

    // filter for empty rooms
    // add new user to empty room
    const filtered = testArr.filter((item) => item.users.length < 2);

    if (filtered.length > 0) {
      filtered[0].users.push(uuidv4());

      console.log("//////////");
      console.log(testArr);
      return testArr;
    } else {
      console.log("zero space detected");
      const room = uuidv4();
      const infoObject = {
        roomId: room,
        users: [uuidv4()],
      };

      testArr.push(infoObject);

      return testArr;
    }
  }
}

newArr = testFunc(testArr);
console.log(newArr);
// testFunc(testArr);
