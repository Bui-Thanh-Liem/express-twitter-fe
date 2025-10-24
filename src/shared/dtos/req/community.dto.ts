import { z } from "zod";
import { CONSTANT_REGEX } from "~/shared/constants";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";

export const CreateCommunityDtoSchema = z.object({
  name: z.string().trim().min(1).max(32),
  cover: z.string().trim().max(200).optional(),
  bio: z.string().trim().max(200).optional(),
  category: z.string().trim().max(16),
  visibilityType: z.nativeEnum(EVisibilityType),
  membershipType: z.nativeEnum(EMembershipType),
  member_ids: z
    .array(
      z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
        message: "Invalid MongoDB ObjectId",
      })
    )
    .optional(),
});

export type CreateCommunityDto = z.infer<typeof CreateCommunityDtoSchema>;
