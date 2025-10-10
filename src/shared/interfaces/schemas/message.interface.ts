import type { IBase } from "./base.interface";
import type { IConversation } from "./conversation.interface";

export interface IMessage extends IBase {
  sender: string;
  conversation: string | IConversation;
  content: string;
  attachments: string[];
}
