import { prisma } from "@/lib/prisma";
import { requireMinRole } from "@/lib/auth-helpers";
import { UserRole, getCreatableRoles } from "@/lib/constants/roles";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import type {
  ContentActions,
  GetContentParams,
  GetContentResult,
  CrudResult,
} from "../types";

// Type for user list items
export type UserListItem = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
};


export const usersActions: ContentActions<UserListItem> = {
  /**
   * Get paginated list of users with optional search
   */
  get: async (
    params: GetContentParams
  ): Promise<GetContentResult<UserListItem>> => {
    const { current, rowCount, searchPhrase } = params;
    const skip = (current - 1) * rowCount;

    const where = searchPhrase
      ? {
          OR: [
            { email: { contains: searchPhrase, mode: "insensitive" as const } },
            { name: { contains: searchPhrase, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: rowCount,
      }),
      prisma.user.count({ where }),
    ]);

    return { rows: rows as UserListItem[], total };
  },

  /**
   * Create a new user
   */
  create: async (data: Record<string, unknown>): Promise<CrudResult> => {
    const session = await requireMinRole(UserRole.ADMIN, false);

    if (!session) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          title: "Unauthorized",
          description: "You must be logged in to create users.",
        },
      };
    }

    // Check if the user can create this role
    const creatableRoles = getCreatableRoles(session.user.role as UserRole);
    if (!creatableRoles.includes(data.role as UserRole)) {
      return {
        success: false,
        error: {
          code: "PERMISSION_DENIED",
          title: "Insufficient permissions",
          description: `You cannot create users with the ${data.role} role.`,
        },
      };
    }

    try {
      const hashedPassword = await bcrypt.hash(data.password as string, 10);

      await prisma.user.create({
        data: {
          name: data.name as string,
          email: data.email as string,
          role: data.role as UserRole,
          password: hashedPassword,
        },
      });

      revalidatePath("/users");

      return { success: true };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          title: "Server error",
          description: "Failed to create user. Please try again.",
        },
      };
    }
  },

  /**
   * Update an existing user
   */
  update: async (
    id: string,
    data: Record<string, unknown>
  ): Promise<CrudResult> => {
    const session = await requireMinRole(UserRole.ADMIN, false);

    if (!session) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          title: "Unauthorized",
          description: "You must be logged in to update users.",
        },
      };
    }

    // Get the user to update
    const userToUpdate = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!userToUpdate) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          title: "User not found",
          description: "The user you're trying to update doesn't exist.",
        },
      };
    }

    // Prevent admins from updating super admins
    if (
      session.user.role === UserRole.ADMIN &&
      userToUpdate.role === UserRole.SUPER_ADMIN
    ) {
      return {
        success: false,
        error: {
          code: "PERMISSION_DENIED",
          title: "Insufficient permissions",
          description: "Admins cannot update Super Admins.",
        },
      };
    }

    // If changing role, check if allowed
    if (data.role && data.role !== userToUpdate.role) {
      const creatableRoles = getCreatableRoles(session.user.role as UserRole);
      if (!creatableRoles.includes(data.role as UserRole)) {
        return {
          success: false,
          error: {
            code: "PERMISSION_DENIED",
            title: "Insufficient permissions",
            description: `You cannot assign the ${data.role} role.`,
          },
        };
      }
    }

    try {
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.role !== undefined) updateData.role = data.role;

      await prisma.user.update({
        where: { id },
        data: updateData,
      });

      revalidatePath("/users");

      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          title: "Server error",
          description: "Failed to update user. Please try again.",
        },
      };
    }
  },

  /**
   * Delete a user
   */
  delete: async (id: string): Promise<CrudResult> => {
    const session = await requireMinRole(UserRole.ADMIN, false);

    if (!session) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          title: "Unauthorized",
          description: "You must be logged in to delete users.",
        },
      };
    }

    // Prevent deleting yourself
    if (session.user.id === id) {
      return {
        success: false,
        error: {
          code: "PERMISSION_DENIED",
          title: "Cannot delete yourself",
          description: "You cannot delete your own account.",
        },
      };
    }

    // Get the user to check their role
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!userToDelete) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          title: "User not found",
          description: "The user you're trying to delete doesn't exist.",
        },
      };
    }

    // Prevent admins from deleting super admins
    if (
      session.user.role === UserRole.ADMIN &&
      userToDelete.role === UserRole.SUPER_ADMIN
    ) {
      return {
        success: false,
        error: {
          code: "PERMISSION_DENIED",
          title: "Insufficient permissions",
          description: "Admins cannot delete Super Admins.",
        },
      };
    }

    try {
      await prisma.user.delete({
        where: { id },
      });

      revalidatePath("/users");

      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          title: "Server error",
          description: "Failed to delete user. Please try again.",
        },
      };
    }
  },
};
