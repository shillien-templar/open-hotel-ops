import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import bcrypt from "bcryptjs";
import { formDataToObject } from "@/lib/forms/core/helpers";

export async function action(formData: FormData | Record<string, unknown>) {
  const data = formData instanceof FormData ? formDataToObject(formData) : formData;

  try {
    // Require authentication
    await requireAuth();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email as string },
    });

    if (existingUser) {
      return {
        status: "error" as const,
        errors: { email: "A user with this email already exists" },
      };
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: data.email as string,
        role: data.role as "ADMIN" | "FRONT_DESK" | "HOUSEKEEPING",
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      status: "success" as const,
      data: {
        user,
        tempPassword, // In production, this should be sent via email instead
        message: `User created successfully. Temporary password: ${tempPassword}`,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: "error" as const,
      errors: { _form: "Failed to create user. Please try again." },
    };
  }
}
