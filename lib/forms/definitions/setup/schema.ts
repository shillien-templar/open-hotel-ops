import { buildSchema } from "@/lib/forms/core/helpers";
import { fields } from "./fields";

export const schema = buildSchema(fields);
