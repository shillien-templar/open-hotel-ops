import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Alert } from "@/lib/types/alert";

export async function POST(request: NextRequest) {
  try {
    const { secret, email, password } = await request.json();
    const setupSecret = process.env.SETUP_SECRET;

    if (!setupSecret) {
      return NextResponse.json(
        {
          error: {
            title: "Setup secret not configured",
            description: "SETUP_SECRET environment variable is not set.",
          } satisfies Alert,
        },
        { status: 400 }
      );
    }

    if (secret !== setupSecret) {
      return NextResponse.json(
        {
          error: {
            title: "Invalid setup secret",
            description: "The setup secret you provided is incorrect.",
          } satisfies Alert,
        },
        { status: 401 }
      );
    }

    const superAdminExists = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    if (superAdminExists) {
      return NextResponse.json(
        {
          error: {
            title: "Super admin already exists",
            description: "A super admin account has already been created. Please remove SETUP_SECRET from your environment variables.",
          } satisfies Alert,
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });

    return NextResponse.json({
      success: {
        title: "Setup complete!",
        description: "Super admin account created successfully. You can now remove SETUP_SECRET from your environment variables and sign in.",
      } satisfies Alert,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      {
        error: {
          title: "Failed to create admin account",
          description: "An unexpected error occurred. Please try again.",
        } satisfies Alert,
      },
      { status: 500 }
    );
  }
}
