import z from "zod";
import { CONSTANT_REGEX } from "~/shared/constants";

export const QueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(2).max(100).default(10),
  q: z.string().trim().optional(),
  f: z.string().trim().optional(),
  t: z.string().trim().optional(),
  pf: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val === "on", {
      message: "People follow invalid (on)",
    }),
  profile_id: z
    .string()
    .trim()
    .regex(CONSTANT_REGEX.ID_MONGO, {
      message: "Invalid MongoDB ObjectId",
    })
    .optional(),
  ishl: z.enum(["0", "1"]).default("0"),
});

export type QueryDto = z.infer<typeof QueryDtoSchema>;
