/**
 * Application role definitions.
 * This is the single source of truth for user roles in the application.
 * Keep in sync with Prisma schema UserRole enum.
 */
export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  FRONT_DESK: "FRONT_DESK",
  HOUSEKEEPING: "HOUSEKEEPING",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Role hierarchy for permission checking.
 * Higher index = higher permissions.
 */
export const ROLE_HIERARCHY: UserRole[] = [
  UserRole.HOUSEKEEPING,
  UserRole.FRONT_DESK,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

/**
 * Get the hierarchy level of a role.
 * Returns -1 if role is not found.
 */
export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

/**
 * Check if a role has at least the minimum required level.
 */
export function hasMinimumRole(userRole: UserRole, minRole: UserRole): boolean {
  const userLevel = getRoleLevel(userRole);
  const minLevel = getRoleLevel(minRole);
  return userLevel >= minLevel;
}

/**
 * Get a human-readable label for a role.
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: "Super Admin",
    [UserRole.ADMIN]: "Admin",
    [UserRole.FRONT_DESK]: "Front Desk",
    [UserRole.HOUSEKEEPING]: "Housekeeping",
  };
  return labels[role] || role;
}

/**
 * Get roles that a user can create based on their own role.
 * Super Admin can create Admin, Front Desk, Housekeeping
 * Admin can create Front Desk, Housekeeping
 */
export function getCreatableRoles(userRole: UserRole): UserRole[] {
  switch (userRole) {
    case UserRole.SUPER_ADMIN:
      return [UserRole.ADMIN, UserRole.FRONT_DESK, UserRole.HOUSEKEEPING];
    case UserRole.ADMIN:
      return [UserRole.FRONT_DESK, UserRole.HOUSEKEEPING];
    default:
      return [];
  }
}
