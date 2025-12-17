import { auth } from "@/auth";

export default auth((req) => {
  // Basic middleware - will be expanded later
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
