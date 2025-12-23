import { NextRequest, NextResponse } from "next/server";
import { validateFormData } from "@/lib/forms/validation";
import { getFormSchema, executeFormAction } from "@/lib/forms/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  // Get the schema for this action
  const schema = getFormSchema(action);
  if (!schema) {
    return NextResponse.json(
      {
        status: "error",
        errors: { _form: "Invalid form action" },
        alert: {
          variant: "destructive",
          title: "Invalid form action",
          description: "The form action you requested does not exist.",
        }
      },
      { status: 400 }
    );
  }

  // Parse FormData
  const formData = await request.formData();

  // Validate (server-side)
  const validation = validateFormData(schema, formData);
  if (validation.status === "fail") {
    return NextResponse.json(
      {
        status: "error",
        errors: validation.errors,
        alert: {
          variant: "destructive",
          title: "Validation failed",
          description: "Please check the form fields and try again.",
        }
      },
      { status: 400 }
    );
  }

  // Execute the action
  const result = await executeFormAction(action, validation.data);

  return NextResponse.json(result);
}
