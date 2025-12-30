import { NextRequest, NextResponse } from "next/server";
import { isValidContentType, getContentAction } from "@/lib/content/registry";
import type {
  ContentListResponse,
  ContentMutationResponse,
} from "@/lib/content/types";

/**
 * GET - List content with pagination and search
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Validate content type
    if (!isValidContentType(type)) {
      return NextResponse.json(
        {
          status: "fail",
          errors: { 400: `Unknown content type: ${type}` },
        } satisfies ContentListResponse<unknown>,
        { status: 400 }
      );
    }

    // Parse query parameters
    const current = parseInt(searchParams.get("current") ?? "1");
    const rowCount = parseInt(searchParams.get("rowCount") ?? "10");
    const searchPhrase = searchParams.get("searchPhrase") ?? undefined;

    // Get and execute the handler
    const handler = getContentAction(type, "get");
    const result = await handler({ current, rowCount, searchPhrase });

    // Return response in expected format
    return NextResponse.json({
      status: "success",
      data: {
        list: {
          rows: result.rows,
          total: result.total.toString(),
        },
      },
    } satisfies ContentListResponse<typeof result.rows[number]>);
  } catch (error) {
    console.error("Content API GET error:", error);
    return NextResponse.json(
      {
        status: "fail",
        errors: { 500: "Failed to fetch content" },
      } satisfies ContentListResponse<unknown>,
      { status: 500 }
    );
  }
}

/**
 * POST - Create new content
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    // Validate content type
    if (!isValidContentType(type)) {
      return NextResponse.json(
        {
          status: "fail",
          errors: { 400: `Unknown content type: ${type}` },
        } satisfies ContentMutationResponse,
        { status: 400 }
      );
    }

    // Parse request body
    const data = await request.json();

    // Get and execute the handler
    const handler = getContentAction(type, "create");
    const result = await handler(data);

    return NextResponse.json(result satisfies ContentMutationResponse, {
      status: result.status === "success" ? 201 : 400,
    });
  } catch (error) {
    console.error("Content API POST error:", error);
    return NextResponse.json(
      {
        status: "fail",
        errors: { 500: "Failed to create content" },
      } satisfies ContentMutationResponse,
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update existing content (partial update)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    // Validate content type
    if (!isValidContentType(type)) {
      return NextResponse.json(
        {
          status: "fail",
          errors: { 400: `Unknown content type: ${type}` },
        } satisfies ContentMutationResponse,
        { status: 400 }
      );
    }

    // Parse request body
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          status: "fail",
          errors: { 400: "Missing required field: id" },
        } satisfies ContentMutationResponse,
        { status: 400 }
      );
    }

    // Get and execute the handler
    const handler = getContentAction(type, "update");
    const result = await handler(id, data);

    return NextResponse.json(result satisfies ContentMutationResponse, {
      status: result.status === "success" ? 200 : 400,
    });
  } catch (error) {
    console.error("Content API PATCH error:", error);
    return NextResponse.json(
      {
        status: "fail",
        errors: { 500: "Failed to update content" },
      } satisfies ContentMutationResponse,
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove content
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    // Validate content type
    if (!isValidContentType(type)) {
      return NextResponse.json(
        {
          status: "fail",
          errors: { 400: `Unknown content type: ${type}` },
        } satisfies ContentMutationResponse,
        { status: 400 }
      );
    }

    // Parse request body
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          status: "fail",
          errors: { 400: "Missing required field: id" },
        } satisfies ContentMutationResponse,
        { status: 400 }
      );
    }

    // Get and execute the handler
    const handler = getContentAction(type, "delete");
    const result = await handler(id);

    return NextResponse.json(result satisfies ContentMutationResponse, {
      status: result.status === "success" ? 200 : 400,
    });
  } catch (error) {
    console.error("Content API DELETE error:", error);
    return NextResponse.json(
      {
        status: "fail",
        errors: { 500: "Failed to delete content" },
      } satisfies ContentMutationResponse,
      { status: 500 }
    );
  }
}
