import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  isSiteAuthCookieValid,
  sitePasswordEnabled,
} from "@/lib/site-auth";

const PUBLIC_PATHS = ["/site-login", "/api/site-auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function middleware(request: NextRequest) {
  if (!sitePasswordEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(AUTH_COOKIE)?.value;
  const valid = await isSiteAuthCookieValid(
    cookieValue,
    process.env.SITE_PASSWORD,
  );

  if (valid) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/site-login";
  loginUrl.searchParams.set(
    "from",
    `${pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
