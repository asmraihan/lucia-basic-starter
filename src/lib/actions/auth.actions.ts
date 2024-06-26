"use server";

import * as argon2 from "argon2";
import { cookies } from "next/headers";
import { z } from "zod";

import { SignInSchema, SignUpSchema } from "../../../zod/auth.schemas";

import { lucia, validateRequest } from "@/lib/lucia/luciaAuth";
import { prisma } from "../../../prisma/prismaClient";
import { generateCodeVerifier, generateState } from "arctic";
import { google } from "../lucia/oauth";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  try {
    SignUpSchema.parse(values);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  const hashedPassword = await argon2.hash(values.password);

  try {
    const user = await prisma.user.create({
      data: {
        username: values.username,
        password: hashedPassword,
      },
      select: { id: true, username: true },
    });

    // {
    //   expiresAt: 60 * 60 * 24 * 30,
    // }
    const session = await lucia.createSession(user.id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      success: true,
      data: {
        userId: user.id,
      },
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  try {
    SignInSchema.parse(values);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username: values.username,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  if (!existingUser.password) {
    return {
      error: "User not found",
    };
  }

  const isValidPassword = await argon2.verify(
    existingUser.password,
    values.password,
  );

  if (!isValidPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return {
    success: "Logged in successfully",
  };
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};


export const createGoogleAuthorizationURL = async () => {
 try {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  cookies().set("codeVerifier", codeVerifier, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
  });

  cookies().set("state", state, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
  });
  
  const authorizationURL = await google.createAuthorizationURL(
    state, 
    codeVerifier,
    {
      scopes: ["email", "profile"],
    }
    );

  return {
    success: true,
    data: authorizationURL
  }

 } catch (error : any) {
    return {
      error: error?.message
    }
 }
}

// const tokens = await github.validateAuthorizationCode(code);