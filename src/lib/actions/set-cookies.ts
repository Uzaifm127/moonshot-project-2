"use server";

import { cookies } from "next/headers";

export const setCookies = async (token: string) => {
  cookies().set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
};
