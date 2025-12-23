import { z } from "zod";
import { formDataToObject } from "./helpers";

export function validateFormData<T extends z.ZodType>(
  schema: T,
  data: FormData | Record<string, unknown>
): { status: "success"; data: z.infer<T> } | { status: "fail"; errors: Record<string, string> } {
  const obj = data instanceof FormData ? formDataToObject(data) : data;
  const result = schema.safeParse(obj);

  if (result.status === "success") {
    return { status: "success", data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  });

  return { status: "fail", errors };
}
