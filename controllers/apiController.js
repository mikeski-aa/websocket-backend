import bcrypt from "bcryptjs";

async function testController(req, res) {
  const hash = bcrypt.hashSync("B4c0//", 10);
  res.send(hash);
}

export { testController };
