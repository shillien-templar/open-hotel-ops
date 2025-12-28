import { prisma } from "@/lib/prisma";
import { requireMinRole } from "@/lib/auth-helpers";
import { UserRole, getCreatableRoles } from "@/lib/constants/roles";
import bcrypt from "bcryptjs";
import { formDataToObject } from "@/lib/forms/core/helpers";
import { revalidatePath } from "next/cache";

export async function action(formData: FormData | Record<string, unknown>) {
  const data = formData instanceof FormData ? formDataToObject(formData) : formData;

  try {
    // Require at least Admin role
    const session = await requireMinRole(UserRole.ADMIN, false);

    if (!session) {
      return {
        status: "fail" as const,
        alert: {
          variant: "destructive" as const,
          title: "Unauthorized",
          description: "You don't have permission to create users.",
        },
      };
    }

    // Check if the user can create this role
    const creatableRoles = getCreatableRoles(session.user.role as UserRole);
    if (!creatableRoles.includes(data.role as UserRole)) {
      return {
        status: "fail" as const,
        alert: {
          variant: "destructive" as const,
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
        status: "fail" as const,
        fieldErrors: {
          email: "A user with this email already exists",
        },
      };
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
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
      status: "success" as const,
      alert: {
        variant: "success" as const,
        title: "User created",
        description: `User created successfully. Temporary password: ${tempPassword}`,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: "fail" as const,
      alert: {
        variant: "destructive" as const,
        title: "Error",
        description: "Failed to create user. Please try again.",
      },
    };
  }
}
