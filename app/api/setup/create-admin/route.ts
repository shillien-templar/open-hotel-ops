import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { secret, email, password } = await request.json();
    const setupSecret = process.env.SETUP_SECRET;

    if (!setupSecret) {
      return NextResponse.json(
        { error: "Setup secret not configured" },
        { status: 400 }
      );
    }

    if (secret !== setupSecret) {
      return NextResponse.json(
        { error: "Invalid setup secret" },
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
        { error: "Super admin account already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Super admin account created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create admin account" },
      { status: 500 }
    );
  }
}
