import { buildSchema } from "@/lib/forms/helpers";
import { fields } from "./fields";

export const schema = buildSchema(fields);
