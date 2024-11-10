import bcrypt from "bcryptjs";
import { generateHash } from "../utils/passwordHandler.js";
import { createUser } from "../services/logregCalls.js";

async function testController(req, res) {
  const hash = bcrypt.hashSync("B4c0//", 10);
  res.send(hash);
}

// need to register a new user
async function registerUser(req, res) {
  const hash = generateHash(req.body.password);

  console.log(hash);

  const result = await createUser(req.body.username, hash);

  res.send(result);
}

export { testController, registerUser };
