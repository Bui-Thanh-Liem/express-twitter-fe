import { z } from "zod";
import { CONSTANT_REGEX } from "~/shared/constants";

export const ToggleBookmarkDtoSchema = z.object({
  tweet_id: z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
    message: "ObjectId không hợp lệ",
  }),
});

export type ToggleBookmarkDto = z.infer<typeof ToggleBookmarkDtoSchema>;
