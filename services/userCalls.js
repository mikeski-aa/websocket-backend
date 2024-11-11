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

async function getAllUsers() {
  try {
    const result = await prisma.Users.findMany({
      select: {
        username: true,
        gameswon: true,
        gameslost: true,
        currentstreak: true,
        maxstreak: true,
        hash: false,
      },
    });

    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}
getAllUsers();
export { createUser, getUser };
