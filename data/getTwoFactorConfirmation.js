import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
