import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  siteAuthToken,
  sitePasswordEnabled,
} from "@/lib/site-auth";

export async function POST(request: Request) {
  if (!sitePasswordEnabled()) {
    return NextResponse.json({ ok: true });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await siteAuthToken(password);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
