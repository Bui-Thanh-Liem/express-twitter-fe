import { EConversationType } from "~/shared/enums/type.enum";
import type { IBase } from "./base.interface";

export interface IConversation extends IBase {
  name: string | null; // group - có tên, private - lấy tên của participants (không phải mình)
  avatar: string[] | string | null; // group - lấy tất cả avatar, private - lấy avatar của participants (không phải mình)
  type: EConversationType;
  participants: string[];
  deletedFor: string[];
  pinned: IPinned[];

  //
  lastMessage: string | null;
  readStatus: string[] | null;

  //
  username?: string; // Đơn giản hóa tính năng xem trang cá nhân tại cuộc trò chuyện (type === private)
}

//
export interface IPinned {
  user_id: string;
  at: Date;
}
