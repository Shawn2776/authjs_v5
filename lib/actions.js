"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import bcrypt from "bcryptjs";
import {
  LoginSchema,
  RegisterSchema,
  ResetSchema,
  newPasswordSchema,
} from "@/schemas";
import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getUserByEmail } from "@/data/getUser";
import { db } from "./db";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "./tokens";
import {
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "./mail";
import { getVerificationTokenByToken } from "@/data/getVerificationToken";
import { getPasswordResetTokenByToken } from "@/data/getPasswordResetToken copy";
import { getTwoFactorTokenByEmail } from "@/data/getTwoFactorToken";
import { getTwoFactorConfirmationByUserId } from "@/data/getTwoFactorConfirmation";

export const Login = async (values) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "Invalid Credentials!" };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation Email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid 2FA Code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) return { error: "2FA Code has expired!" };

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const exisitingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (exisitingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: exisitingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

export const Logout = async () => {
  // opportunity to do server stuff before logging out
  await signOut();
};

export const Register = async (values) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { name, email, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: "Email already in use!" };

  // Save user to database
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Verification Email sent!" };
};

export const NewVerification = async (token) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: "Token does not exist!!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Email does not exist!" };

  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email Verified!" };
};

export const ResetPassword = async (values) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid Fields!" };

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: "Email not found!" };

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset Email sent!" };
};

export const NewPassword = async (values, token) => {
  if (!token) return { error: "Missing Token!" };

  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid Fields!" };

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) return { error: "Token not found!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Email not found!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password Updated!" };
};
