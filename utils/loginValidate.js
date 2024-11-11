import { getUser } from "../services/userCalls.js";

async function validateUser(req, res, next) {
  const user = await getUser(req.body.username);

  if (user != null) {
    return user;
  } else {
    return false;
  }
}

export { validateUser };
