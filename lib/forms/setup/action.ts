import type { SetupFormData } from "./schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Alert } from "@/lib/types/alert";

export async function action(data: SetupFormData) {
  try {
    const setupSecret = process.env.SETUP_SECRET;

    if (!setupSecret) {
      return {
        status: "error" as const,
        alert: {
          variant: "destructive",
          title: "Setup secret not configured",
          description: "SETUP_SECRET environment variable is not set.",
        } satisfies Alert,
      };
    }

    if (data.secret !== setupSecret) {
      return {
        status: "error" as const,
        alert: {
          variant: "destructive",
          title: "Invalid setup secret",
          description: "The setup secret you provided is incorrect.",
        } satisfies Alert,
      };
    }

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

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        email: data.email,
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
