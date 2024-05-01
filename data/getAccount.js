import { db } from "@/lib/db";

export const getAccountByUserId = async (userId) => {
  try {
    const account = await db.account.findUnique({
      where: {
        userId,
      },
    });

    console.log("account>>", account);
    return account;
  } catch (error) {
    return null;
  }
};
