import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function addUser(user, chat) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        telegramId: user.id,
      },
    });
    if (existingUser) {
      const updatedUser = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          telegramChatId: chat.id,
        },
      });
      console.log("User Updated", updatedUser);
      return updatedUser;
    }
    const newUser = await prisma.user.create({
      data: {
        telegramId: user.id,
        telegramFullName: `${user.first_name}${
          user.last_name ? ` ${user.last_name}` : ""
        }`,
        telegramUsername: user.username,
        telegramChatId: chat.id,
      },
    });
    console.log("User Created", newUser);
    return newUser;
  } catch (error) {
    console.warn("User Creation Error", error);
    return null;
  }
}

async function updateUserInfo(userId, key, value) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        telegramId: userId,
      },
    });
    if (!existingUser) {
      console.log("User not found");
      return null;
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        [key]: value,
      },
    });
    console.log("User Updated", updatedUser);
    return updatedUser;
  } catch (error) {
    console.warn("User Update Error", error);
    return null;
  }
}

async function getUser(telegramId) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        telegramId,
      },
    });
    return user;
  } catch (error) {
    console.warn("User Get Error", error);
    return null;
  }
}

async function countUser() {
  try {
    const withPhoneNumber = await prisma.user.count({
      where: {
        phoneNumber: {
          not: null,
        },
      },
    });
    const adPermission = await prisma.user.count({
      where: {
        advert: true,
      },
    });
    const all = await prisma.user.count();
    return {
      withPhoneNumber,
      all,
      adPermission,
    };
  } catch (error) {
    console.warn("User Count Error", error);
    return null;
  }
}

async function getTelegramChatIds(options) {
  try {
    const chatIds = await prisma.user.findMany({
      ...options,
      select: {
        telegramChatId: true,
      },
    });
    return chatIds;
  } catch (error) {
    console.warn("Telegram Chat Ids Get Error", error);
    return null;
  }
}

export { addUser, updateUserInfo, getUser, countUser, getTelegramChatIds };
