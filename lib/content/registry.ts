import type {
  ContentType,
  ContentActionType,
  ContentActions,
  GetHandler,
  CreateHandler,
  UpdateHandler,
  DeleteHandler,
} from "./types";
import { usersActions } from "./users/actions";

/**
 * Registry mapping content types to their action handlers
 */
const contentRegistry: Record<ContentType, ContentActions<unknown>> = {
  users: usersActions,
};

/**
 * Check if a content type is valid/registered
 */
export function isValidContentType(type: string): type is ContentType {
  return type in contentRegistry;
}

/**
 * Get all actions for a content type
 */
export function getContentActions(
  type: ContentType
): ContentActions<unknown> | null {
  return contentRegistry[type] ?? null;
}

/**
 * Get a specific action handler for a content type
 */
export function getContentAction<T extends ContentActionType>(
  type: ContentType,
  action: T
): T extends "get"
  ? GetHandler<unknown>
  : T extends "create"
    ? CreateHandler
    : T extends "update"
      ? UpdateHandler
      : T extends "delete"
        ? DeleteHandler
        : never {
  const actions = contentRegistry[type];
  if (!actions) {
    throw new Error(`Unknown content type: ${type}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return actions[action] as any;
}

/**
 * Get the list of registered content types
 */
export function getRegisteredContentTypes(): ContentType[] {
  return Object.keys(contentRegistry) as ContentType[];
}
