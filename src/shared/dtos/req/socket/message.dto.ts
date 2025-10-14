import { z } from "zod";
import { MediaSchema } from "../tweet.dto";

export const sendMessageDtoSchema = z.object({
  conversation: z.string().min(1, "conversationId is required"),
  sender: z.string().min(1, "conversationId is required"),
  content: z.string().min(1, "text cannot be empty"),
  attachments: z.array(MediaSchema).optional(),
});

export type sendMessageDto = z.infer<typeof sendMessageDtoSchema>;
