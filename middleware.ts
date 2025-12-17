import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isAuthPage = pathname.startsWith("/auth");
  const isSetupPage = pathname.startsWith("/setup");

  if (!isLoggedIn && !isAuthPage && !isSetupPage) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (isLoggedIn && (isAuthPage || isSetupPage)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
