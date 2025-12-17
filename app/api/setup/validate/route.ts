import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
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

    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to validate secret" },
      { status: 500 }
    );
  }
}
