import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/content";
import { isSitePublic } from "@/lib/site";

export async function POST(request: Request) {
  const settings = await getSiteSettings();
  const { passwordProtectionEnabled, previewPassword } = settings.siteAccess;

  if (isSitePublic() || !passwordProtectionEnabled) {
    return NextResponse.json({ ok: true });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!password || password !== previewPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
