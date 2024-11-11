import bcrypt from "bcryptjs";
import { generateHash, validateHash } from "../utils/passwordHandler.js";
import { createUser, getUser } from "../services/userCalls.js";
import { validateUser } from "../utils/loginValidate.js";
import jwt from "jsonwebtoken";
import {
  updateLosses,
  updateMaxStreak,
  updateWins,
} from "../services/gamesCalls.js";

async function testController(req, res) {
  const hash = bcrypt.hashSync("B4c0//", 10);
  res.send(hash);
}

// need to register a new user
async function registerUser(req, res) {
  const hash = generateHash(req.body.password);

  console.log(hash);

  const result = await createUser(req.body.username, hash);

  return res.json({ username: result.username, id: result.id, error: false });
}

// user login
async function userLogin(req, res) {
  console.log(req.body);
  const user = await validateUser(req.body.username);
  console.log(user);
  if (!user) {
    return res.status(400).json({ error: "No user found" });
  }

  const pwValidate = validateHash(req.body.password, user.hash);

  if (!pwValidate) {
    return res
      .status(400)
      .json({ error: true, errorMessage: "Password validation failed" });
  }

  const payload = {
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "336h",
  });

  return res.json({
    token: token,
    error: false,
    username: user.username,
    id: user.id,
    error: false,
    gameswon: user.gameswon,
    gameslost: user.gameslost,
    currentstreak: user.currentstreak,
    maxstreak: user.maxstreak,
  });
}

async function oneClickLogin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split("Bearer ")[1];
  console.log(token);

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log("token error");
      return console.log(err);
    }

    req.username = decoded.username;
    const user = await getUser(decoded.username);

    return res.json({
      username: user.username,
      id: user.id,
      error: false,
      gameswon: user.gameswon,
      gameslost: user.gameslost,
      currentstreak: user.currentstreak,
      maxstreak: user.maxstreak,
    });
  });
}

async function updateUserWins(req, res, next) {
  const response = await updateWins(req.username);

  console.log(response);

  // update max streak if it is larger
  if (response.currentstreak > response.maxstreak) {
    const updatedResponse = await updateMaxStreak(
      req.username,
      response.currentstreak
    );

    return res.json({
      username: updatedResponse.username,
      id: updatedResponse.id,
      error: false,
      gameswon: updatedResponse.gameswon,
      gameslost: updatedResponse.gameslost,
      currentstreak: updatedResponse.currentstreak,
      maxstreak: updatedResponse.maxstreak,
    });
  }

  // if max streak not larger just update the regular
  return res.json({
    username: response.username,
    id: response.id,
    error: false,
    gameswon: response.gameswon,
    gameslost: response.gameslost,
    currentstreak: response.currentstreak,
    maxstreak: response.maxstreak,
  });
}

// update user losses, reset current win streak to 0
async function updateUserLosses(req, res, next) {
  const response = await updateLosses(req.username);

  // if max streak not larger just update the regular
  return res.json({
    username: response.username,
    id: response.id,
    error: false,
    gameswon: response.gameswon,
    gameslost: response.gameslost,
    currentstreak: response.currentstreak,
    maxstreak: response.maxstreak,
  });
}

export {
  testController,
  registerUser,
  userLogin,
  oneClickLogin,
  updateUserWins,
  updateUserLosses,
};
