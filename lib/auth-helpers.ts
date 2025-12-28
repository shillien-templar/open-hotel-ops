import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole, getRoleLevel } from "@/lib/constants/roles";
import type { Session } from "next-auth";

/**
 * Require authentication.
 * @param shouldRedirect - If true, redirects to sign-in. If false, returns null (for API routes).
 */
export async function requireAuth(shouldRedirect: boolean = true): Promise<Session | null> {
  const session = await auth();

  if (!session) {
    if (shouldRedirect) {
      redirect("/auth/signin");
    }
    return null;
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

/**
 * Require a specific role.
 * @param role - The required role
 * @param shouldRedirect - If true, redirects to unauthorized. If false, returns null (for API routes).
 */
export async function requireRole(role: UserRole, shouldRedirect: boolean = true): Promise<Session | null> {
  const session = await requireAuth(shouldRedirect);

  if (!session || session.user.role !== role) {
    if (shouldRedirect) {
      redirect("/unauthorized");
    }
    return null;
  }

  return session;
}

/**
 * Require at least a minimum role level.
 * @param minRole - The minimum required role
 * @param shouldRedirect - If true, redirects to unauthorized. If false, returns null (for API routes).
 */
export async function requireMinRole(minRole: UserRole, shouldRedirect: boolean = true): Promise<Session | null> {
  const session = await requireAuth(shouldRedirect);

  if (!session) {
    return null;
  }

  const userLevel = getRoleLevel(session.user.role);
  const minLevel = getRoleLevel(minRole);

  if (userLevel < minLevel) {
    if (shouldRedirect) {
      redirect("/unauthorized");
    }
    return null;
  }

  return session;
}

/**
 * Check if the current user has a specific role (non-redirecting).
 * Returns the session if the user has the role, null otherwise.
 */
export async function hasRole(role: UserRole): Promise<Session | null> {
  const session = await auth();

  if (!session || session.user.role !== role) {
    return null;
  }

  return session;
}

/**
 * Check if the current user has at least a minimum role level (non-redirecting).
 * Returns the session if the user has sufficient permissions, null otherwise.
 */
export async function hasMinRole(minRole: UserRole): Promise<Session | null> {
  const session = await auth();

  if (!session) {
    return null;
  }

  const userLevel = getRoleLevel(session.user.role);
  const minLevel = getRoleLevel(minRole);

  if (userLevel < minLevel) {
    return null;
  }

  return session;
}
