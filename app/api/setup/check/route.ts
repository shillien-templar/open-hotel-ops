import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const superAdminExists = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    return NextResponse.json({ adminExists: !!superAdminExists });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check super admin status" },
      { status: 500 }
    );
  }
}
