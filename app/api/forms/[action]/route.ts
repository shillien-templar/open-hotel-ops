import { NextRequest, NextResponse } from "next/server";
import { processForm } from "@/lib/forms/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  // Parse FormData
  const formData = await request.formData();

  // Process form (validates schema, validates data, executes action)
  const result = await processForm(action, formData);

  return NextResponse.json(result);
}
