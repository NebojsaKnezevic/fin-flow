import * as z from "zod";

export const getJsonSchema = (
  schema: z.ZodType,
  schemaName?: string,
  asString = false,
) => {
  const jsonSchema = z.toJSONSchema(schema, {
    unrepresentable: "any",
    override: (ctx) => {
      const def = ctx.zodSchema._zod.def;
      if (def.type === "date") {
        ctx.jsonSchema.type = "string";
        ctx.jsonSchema.format = "date-time";
      }
    },
  });

  const result = schemaName ? { title: schemaName, ...jsonSchema } : jsonSchema;

  return asString ? JSON.stringify(result, null, 2) : result;
};
