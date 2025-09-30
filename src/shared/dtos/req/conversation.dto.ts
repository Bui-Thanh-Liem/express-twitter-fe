import { z } from "zod";
import { CONSTANT_REGEX } from "~/shared/constants";
import { EConversationType } from "~/shared/enums/type.enum";

export const CreateConversationDtoSchema = z
  .object({
    type: z.nativeEnum(EConversationType),
    name: z.string().trim().max(10).optional(),
    avatar: z.string().trim().max(10).optional(),
    participants: z.array(z.string().trim().regex(CONSTANT_REGEX.ID_MONGO), {
      message: "Invalid MongoDB ObjectId",
    }),
  })
  .refine(
    (data) => {
      if (data.type === EConversationType.Group) {
        return !!data.name;
      }
      return true;
    },
    {
      message: "Cuộc trò chuyện công khai phải có tên.",
      path: ["name"],
    }
  )
  .refine(
    (data) => {
      if (data.type === EConversationType.Private) {
        return data.participants.length == 1; // người dùng đang sử dụng nữa là 2
      }
      return true;
    },
    {
      message: "Cuộc trò chuyện riêng tư phải có đúng 2 thành viên.",
      path: ["participants"],
    }
  )
  .refine(
    (data) => {
      if (data.type === EConversationType.Group) {
        return data.participants.length >= 2;
      }
      return true;
    },
    {
      message: "Cuộc trò chuyện công khai phải có ít nhất 3 thành viên.",
      path: ["participants"],
    }
  );

export const ConversationIdDtoSchema = z.object({
  conversation_id: z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
    message: "Invalid MongoDB ObjectId",
  }),
});

export type CreateConversationDto = z.infer<typeof CreateConversationDtoSchema>;
export type ReadConversationDto = z.infer<typeof ConversationIdDtoSchema>;
export type DeleteConversationDto = z.infer<typeof ConversationIdDtoSchema>;
