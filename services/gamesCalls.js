import prisma from "../config/db.js";

async function updateWins(username) {
  try {
    const response = await prisma.Users.update({
      where: {
        username: username,
      },
      data: {
        gameswon: { increment: 1 },
        currentstreak: { increment: 1 },
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return { error: true, errorMessage: "Error updating user" };
  }
}

async function updateMaxStreak(username, currentstreak) {
  try {
    const response = await prisma.Users.update({
      where: {
        username: username,
      },
      data: {
        maxstreak: +currentstreak,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return { error: true, errorMessage: "Error updating user" };
  }
}

export { updateWins, updateMaxStreak };
