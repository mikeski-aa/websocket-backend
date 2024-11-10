import prisma from "../config/db.js";

async function createUser(username, hash) {
  try {
    const result = await prisma.user.create({
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

export { createUser };
