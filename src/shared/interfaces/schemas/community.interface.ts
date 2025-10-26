import type {
  EMembershipType,
  EVisibilityType,
} from "~/shared/enums/type.enum";
import { type IBase } from "./base.interface";
import type { IUser } from "./user.interface";

export interface ICommunity extends IBase {
  name: string;
  slug: string;
  cover: string;
  admin: IUser;
  bio: string;
  pin: boolean;
  visibilityType: EVisibilityType; // tất cả mọi người đều thấy nhưng không thể tương tác
  membershipType: EMembershipType; // chỉ members thấy

  category: string;
  verify: boolean;

  pinned?: boolean;
  isJoined?: boolean;
  isAdmin?: boolean;
  isMember?: boolean;
  isMentor?: boolean;
  member_count?: number;

  members?: IUser[];
  mentors?: IUser[];
}
