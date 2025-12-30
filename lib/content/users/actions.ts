import { prisma } from "@/lib/prisma";
import { requireMinRole } from "@/lib/auth-helpers";
import { UserRole, getCreatableRoles } from "@/lib/constants/roles";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import type {
  ContentActions,
  GetContentParams,
  GetContentResult,
  ActionResult,
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
  get: async (params: GetContentParams): Promise<GetContentResult<UserListItem>> => {
    const { current, rowCount, searchPhrase } = params;
    const skip = (current - 1) * rowCount;

    // Build where clause for search
    const where = searchPhrase
      ? {
          OR: [
            { email: { contains: searchPhrase, mode: "insensitive" as const } },
            { name: { contains: searchPhrase, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Execute queries in parallel
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
  create: async (data: Record<string, unknown>): Promise<ActionResult> => {
    const session = await requireMinRole(UserRole.ADMIN, false);

    if (!session) {
      return {
        status: "fail",
        alert: {
          variant: "destructive",
          title: "Unauthorized",
          description: "You don't have permission to create users.",
        },
      };
    }

    try {
      // Check if the user can create this role
      const creatableRoles = getCreatableRoles(session.user.role as UserRole);
      if (!creatableRoles.includes(data.role as UserRole)) {
        return {
          status: "fail",
          alert: {
            variant: "destructive",
            title: "Insufficient permissions",
            description: `You cannot create users with the ${data.role} role.`,
          },
        };
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email as string },
      });

      if (existingUser) {
        return {
          status: "fail",
          fieldErrors: {
            email: "A user with this email already exists",
          },
        };
      }

      // Generate a temporary password
      const tempPassword =
        Math.random().toString(36).slice(-12) +
        Math.random().toString(36).slice(-12);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Create the user
      await prisma.user.create({
        data: {
          name: data.name as string,
          email: data.email as string,
          role: data.role as UserRole,
          password: hashedPassword,
        },
      });

      revalidatePath("/users");

      return {
        status: "success",
        alert: {
          variant: "success",
          title: "User created",
          description: `User created successfully. Temporary password: ${tempPassword}`,
        },
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        status: "fail",
        alert: {
          variant: "destructive",
          title: "Error",
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
  ): Promise<ActionResult> => {
    const session = await requireMinRole(UserRole.ADMIN, false);

    if (!session) {
      return {
        status: "fail",
        alert: {
          variant: "destructive",
          title: "Unauthorized",
          description: "You don't have permission to update users.",
        },
      };
    }

    try {
      // Get the user to update
      const userToUpdate = await prisma.user.findUnique({
        where: { id },
        select: { role: true },
      });

      if (!userToUpdate) {
        return {
          status: "fail",
          alert: {
            variant: "destructive",
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
          status: "fail",
          alert: {
            variant: "destructive",
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
            status: "fail",
            alert: {
              variant: "destructive",
              title: "Insufficient permissions",
              description: `You cannot assign the ${data.role} role.`,
            },
          };
        }
      }

      // Build update data (only include provided fields)
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.role !== undefined) updateData.role = data.role;

      // Update the user
      await prisma.user.update({
        where: { id },
        data: updateData,
      });

      revalidatePath("/users");

      return {
        status: "success",
        alert: {
          variant: "success",
          title: "User updated",
          description: "The user has been successfully updated.",
        },
      };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        status: "fail",
        alert: {
          variant: "destructive",
          title: "Error",
          description: "Failed to update user. Please try again.",
        },
      };
    }
  },

  /**
   * Delete a user
   */
  delete: async (id: string): Promise<ActionResult> => {
    const session = await requireMinRole(UserRole.ADMIN, false);

    if (!session) {
      return {
        status: "fail",
        alert: {
          variant: "destructive",
          title: "Unauthorized",
          description: "You don't have permission to delete users.",
        },
      };
    }

    try {
      // Prevent deleting yourself
      if (session.user.id === id) {
        return {
          status: "fail",
          alert: {
            variant: "destructive",
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
          status: "fail",
          alert: {
            variant: "destructive",
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
          status: "fail",
          alert: {
            variant: "destructive",
            title: "Insufficient permissions",
            description: "Admins cannot delete Super Admins.",
          },
        };
      }

      // Delete the user
      await prisma.user.delete({
        where: { id },
      });

      revalidatePath("/users");

      return {
        status: "success",
        alert: {
          variant: "success",
          title: "User deleted",
          description: "The user has been successfully deleted.",
        },
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        status: "fail",
        alert: {
          variant: "destructive",
          title: "Error",
          description: "Failed to delete user. Please try again.",
        },
      };
    }
  },
};
