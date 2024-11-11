import bcrypt from "bcryptjs";
import { generateHash, validateHash } from "../utils/passwordHandler.js";
import { createUser } from "../services/userCalls.js";
import { validateUser } from "../utils/loginValidate.js";
import jwt from "jsonwebtoken";

async function testController(req, res) {
  const hash = bcrypt.hashSync("B4c0//", 10);
  res.send(hash);
}

// need to register a new user
async function registerUser(req, res) {
  const hash = generateHash(req.body.password);

  console.log(hash);

  const result = await createUser(req.body.username, hash);

  return res.json(result);
}

async function userLogin(req, res) {
  const user = validateUser(req.body.username);

  if (!user) {
    return res.status(400).json({ error: "No user found" });
  }

  const pwValidate = validateHash(req.body.password, user.hash);

  if (!pwValidate) {
    return res.status(400).json({ error: "Invalid login" });
  }

  const payload = {
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "336h",
  });

  return res.json({ user: user, token: token });
}

export { testController, registerUser, userLogin };
