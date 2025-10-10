import { ENotificationType } from "~/shared/enums/type.enum";
import type { IBase } from "./base.interface";
import type { ITweet } from "./tweet.interface";
import type { IUser } from "./user.interface";

export interface INotification extends IBase {
  content: string;
  type: ENotificationType;
  sender: IUser | string;
  receiver: IUser | string;
  isRead: boolean;
  refId: string | undefined;

  tweetRef?: ITweet;
  userRef?: IUser;
}
