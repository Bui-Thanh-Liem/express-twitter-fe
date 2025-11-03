import { ENotificationType } from "~/shared/enums/type.enum";
import type { IBase } from "./base.interface";
import type { ICommunity } from "./community.interface";
import type { ITweet } from "./tweet.interface";
import type { IUser } from "./user.interface";

export interface INotification extends IBase {
  content: string;
  type: ENotificationType;
  sender: IUser | string;
  receiver: IUser | string;
  isRead: boolean;
  ref_id: string | undefined;

  tweet_ref?: ITweet;
  user_ref?: IUser;
  community_ref?: ICommunity;
}
