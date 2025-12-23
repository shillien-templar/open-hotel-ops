import { config as createUserConfig } from "./create-user";
import { config as setupConfig } from "./setup";

export const formRegistry = {
  "create-user": createUserConfig,
  "setup": setupConfig,
  // Add more forms here as they are created
} as const;

export type FormActionName = keyof typeof formRegistry;
