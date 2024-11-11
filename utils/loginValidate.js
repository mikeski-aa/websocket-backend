import { getUser } from "../services/userCalls.js";

async function validateUser(username) {
  const user = await getUser(username);

  if (user != null) {
    return user;
  } else {
    return false;
  }
}

export { validateUser };
