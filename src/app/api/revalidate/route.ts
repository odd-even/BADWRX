import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { SANITY_CACHE_TAG } from "@/lib/cms-cache";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!secret) return false;

  const header = request.headers.get("x-revalidate-secret");
  const query = request.nextUrl.searchParams.get("secret");
  return header === secret || query === secret;
}

/** Purge cached Sanity content after Studio publishes. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(SANITY_CACHE_TAG);

  return NextResponse.json({
    revalidated: true,
    tag: SANITY_CACHE_TAG,
    at: new Date().toISOString(),
  });
}
