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

// ============================================
// CRUD Action Return Types (minimal, no alerts)
// ============================================

// Error codes for CRUD actions
export type CrudErrorCode =
  | "UNAUTHORIZED"
  | "PERMISSION_DENIED"
  | "NOT_FOUND"
  | "SERVER_ERROR";

// CRUD error structure
export interface CrudError {
  code: CrudErrorCode;
  title: string;
  description?: string;
}

// CRUD action result - success
export interface CrudSuccess<T = void> {
  success: true;
  data?: T;
}

// CRUD action result - failure
export interface CrudFailure {
  success: false;
  error: CrudError;
}

// Combined CRUD result type
export type CrudResult<T = void> = CrudSuccess<T> | CrudFailure;

// Action handler signatures
export type GetHandler<T = unknown> = (
  params: GetContentParams
) => Promise<GetContentResult<T>>;

export type CreateHandler<T = void> = (
  data: Record<string, unknown>
) => Promise<CrudResult<T>>;

export type UpdateHandler = (
  id: string,
  data: Record<string, unknown>
) => Promise<CrudResult>;

export type DeleteHandler = (id: string) => Promise<CrudResult>;

// Content actions config for a content type
export interface ContentActions<TList = unknown, TCreate = void> {
  get: GetHandler<TList>;
  create: CreateHandler<TCreate>;
  update: UpdateHandler;
  delete: DeleteHandler;
}

// ============================================
// API Response Types (for REST endpoints)
// ============================================

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
  error?: CrudError;
  fieldErrors?: Record<string, string>;
  errors?: Record<number, string>;
}
