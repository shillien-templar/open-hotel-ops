import { config as createUserConfig } from "./create-user";

export const formRegistry = {
  "create-user": createUserConfig,
  // Add more forms here as they are created
} as const;

export type FormActionName = keyof typeof formRegistry;
