import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Block search indexing until NEXT_PUBLIC_SITE_PUBLIC=true at launch. */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (process.env.NEXT_PUBLIC_SITE_PUBLIC !== "true") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images/|fonts/|robots.txt|sitemap.xml).*)",
  ],
};
