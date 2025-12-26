import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Alert } from "@/lib/types/alert";
import type { FieldDataValidation } from "@/types/forms";

/**
 * Server-side data validation for setup form
 */
export const dataValidation: Record<string, FieldDataValidation> = {
  secret: async (value: unknown) => {
    const setupSecret = process.env.SETUP_SECRET;

    if (!setupSecret) {
      return "Setup secret not configured on server";
    }

    if (value !== setupSecret) {
      return "Invalid setup secret";
    }

    return null;
  },

  confirmPassword: async (value: unknown, formData: Record<string, unknown>) => {
    if (value !== formData.password) {
      return "Passwords don't match";
    }
    return null;
  },
};

/**
 * Setup form action
 */
export async function action(data: unknown) {
  const formData = data as Record<string, unknown>;

  try {
    // Check if super admin already exists
    const superAdminExists = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    if (superAdminExists) {
      return {
        status: "error" as const,
        alert: {
          variant: "destructive",
          title: "Super admin already exists",
          description: "A super admin account has already been created. Please remove SETUP_SECRET from your environment variables.",
        } satisfies Alert,
      };
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(formData.password as string, 10);

    await prisma.user.create({
      data: {
        email: formData.email as string,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });

    return {
      status: "success" as const,
      alert: {
        variant: "success",
        title: "Setup complete!",
        description: "Super admin account created successfully. You can now remove SETUP_SECRET from your environment variables and sign in.",
      } satisfies Alert,
    };
  } catch (error) {
    console.error("Setup error:", error);
    return {
      status: "error" as const,
      alert: {
        variant: "destructive",
        title: "Failed to create admin account",
        description: "An unexpected error occurred. Please try again.",
      } satisfies Alert,
    };
  }
}
