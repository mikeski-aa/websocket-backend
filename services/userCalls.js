import prisma from "../config/db.js";

async function createUser(username, hash) {
  try {
    const result = await prisma.Users.create({
      data: {
        username: username,
        hash: hash,
      },
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

async function getUser(username) {
  try {
    const result = await prisma.Users.findFirst({
      where: {
        username: username,
      },
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

export { createUser, getUser };
