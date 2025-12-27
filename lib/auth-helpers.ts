import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Require authentication for a page. Call this at the top of server components.
 * Redirects to sign-in if not authenticated.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return session;
}

/**
 * Require guest (unauthenticated). Redirects to dashboard if logged in.
 * Use this for auth pages like sign-in, sign-up, etc.
 */
export async function requireGuest() {
  const session = await auth();

  if (session) {
    redirect("/");
  }
}
