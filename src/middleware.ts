import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchAllowSearchIndexing } from "@/lib/site-indexing";

/** Block search indexing until deployment + Sanity allow it. */
export async function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  const allowIndexing = await fetchAllowSearchIndexing();
  if (!allowIndexing) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images/|fonts/|robots.txt|sitemap.xml).*)",
  ],
};
