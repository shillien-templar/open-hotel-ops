import { Alert } from "@/lib/types/alert";

// Supported content types
export type ContentType = "users";

// Action types
export type ContentActionType = "get" | "create" | "update" | "delete";

// Parameters for fetching content list
export interface GetContentParams {
  current: number;
  rowCount: number;
  searchPhrase?: string;
}

// Result from fetching content list
export interface GetContentResult<T> {
  rows: T[];
  total: number;
}

// Standard action result
export interface ActionResult {
  status: "success" | "fail";
  alert?: Alert;
  fieldErrors?: Record<string, string>;
}

// Action handler signatures
export type GetHandler<T = unknown> = (
  params: GetContentParams
) => Promise<GetContentResult<T>>;

export type CreateHandler = (
  data: Record<string, unknown>
) => Promise<ActionResult>;

export type UpdateHandler = (
  id: string,
  data: Record<string, unknown>
) => Promise<ActionResult>;

export type DeleteHandler = (id: string) => Promise<ActionResult>;

// Content actions config for a content type
export interface ContentActions<T = unknown> {
  get: GetHandler<T>;
  create: CreateHandler;
  update: UpdateHandler;
  delete: DeleteHandler;
}

// API response format for GET (list) requests
export interface ContentListResponse<T> {
  status: "success" | "fail";
  data?: {
    list: {
      rows: T[];
      total: string;
    };
  };
  errors?: Record<number, string>;
}

// API response format for mutation requests (POST, PATCH, DELETE)
export interface ContentMutationResponse {
  status: "success" | "fail";
  alert?: Alert;
  fieldErrors?: Record<string, string>;
  errors?: Record<number, string>;
}
