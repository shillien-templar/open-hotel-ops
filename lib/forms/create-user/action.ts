import type { CreateUserFormData } from "./schema";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import bcrypt from "bcryptjs";

export async function action(data: CreateUserFormData) {
  try {
    // Require authentication
    await requireAuth();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
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
        email: data.email,
        role: data.role,
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
