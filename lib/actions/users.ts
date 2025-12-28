"use server";

import { prisma } from "@/lib/prisma";
import { requireMinRole } from "@/lib/auth-helpers";
import { UserRole } from "@/lib/constants/roles";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  const session = await requireMinRole(UserRole.ADMIN, false);

  if (!session) {
    return {
      status: "fail" as const,
      alert: {
        variant: "destructive" as const,
        title: "Unauthorized",
        description: "You don't have permission to delete users.",
      },
    };
  }

  try {
    // Prevent deleting yourself
    if (session.user.id === userId) {
      return {
        status: "fail" as const,
        alert: {
          variant: "destructive" as const,
          title: "Cannot delete yourself",
          description: "You cannot delete your own account.",
        },
      };
    }

    // Get the user to check their role
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!userToDelete) {
      return {
        status: "fail" as const,
        alert: {
          variant: "destructive" as const,
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
        status: "fail" as const,
        alert: {
          variant: "destructive" as const,
          title: "Insufficient permissions",
          description: "Admins cannot delete Super Admins.",
        },
      };
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/users");

    return {
      status: "success" as const,
      alert: {
        variant: "success" as const,
        title: "User deleted",
        description: "The user has been successfully deleted.",
      },
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      status: "fail" as const,
      alert: {
        variant: "destructive" as const,
        title: "Error",
        description: "Failed to delete user. Please try again.",
      },
    };
  }
}
