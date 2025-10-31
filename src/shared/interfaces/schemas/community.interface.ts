import type { EInvitationStatus } from "~/shared/enums/status.enum";
import type {
  EMembershipType,
  EVisibilityType,
} from "~/shared/enums/type.enum";
import { type IBase } from "./base.interface";
import type { IUser } from "./user.interface";

export interface ICommunity extends IBase {
  name: string;
  slug: string;
  desc: string;
  cover: string;
  bio: string;
  admin: string;
  category: string;
  verify: boolean;

  //
  visibilityType: EVisibilityType; // tất cả mọi người đề thấy nhưng không thể tương tác
  membershipType: EMembershipType; // chỉ members thấy
  showLogForMember: boolean;
  showLogForMentor: boolean;
  showInviteListForMember: boolean;
  showInviteListForMentor: boolean;
  inviteExpireDays: number; // Lời mời có hiệu lực trong

  pinned?: boolean;
  isJoined?: boolean;
  isAdmin?: boolean;
  isMember?: boolean;
  isMentor?: boolean;
  member_count?: number;

  members?: IUser[];
  mentors?: IUser[];
}

export interface ICommunityInvitation extends IBase {
  exp: Date;
  user_id: string | IUser;
  inviter: string;
  community_id: string;
  status: EInvitationStatus;
}

export interface ICommunityActivity extends IBase {
  actor_id: string; // người thực hiện hành động
  community_id: string; // cộng đồng bị tác động
  action: string; // ví dụ: "join", "leave", "post_created", ...
  target_id?: string; // nếu có đối tượng cụ thể (bài viết, bình luận, v.v.)
}
