import type {
  EMembershipType,
  EVisibilityType,
} from "~/shared/enums/type.enum";
import { type IBase } from "./base.interface";

export interface ICommunity extends IBase {
  name: string;
  cover: string;
  bio: string;
  pin: boolean;
  visibilityType: EVisibilityType; // tất cả mọi người đều thấy nhưng không thể tương tác
  membershipType: EMembershipType; // chỉ members thấy 

  category: string;
  verify: boolean;
}
