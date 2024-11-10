import bcrypt from "bcryptjs";

async function testController(req, res) {
  const hash = bcrypt.hashSync("B4c0//", 10);
  res.send(hash);
}

// need to register a new user
async function registerUser(req, res) {}

export { testController };
