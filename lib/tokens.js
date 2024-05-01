import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/getVerificationToken";
import { getPasswordResetTokenByEmail } from "@/data/getPasswordResetToken";
import { getTwoFactorTokenByEmail } from "@/data/getTwoFactorToken";

export const generateVerificationToken = async (email) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // One Hour

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // One Hour

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return passwordResetToken;
};

export const generateTwoFactorToken = async (email) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 Minutes

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return twoFactorToken;
};