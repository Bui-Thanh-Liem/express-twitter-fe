import { ETweetAudience } from "~/shared/enums/common.enum";
import { ETweetType } from "~/shared/enums/type.enum";
import type { IMedia } from "../common/media.interface";
import type { IBase } from "./base.interface";

export interface ITweet extends IBase {
  user_id: string;
  type: ETweetType;
  audience: ETweetAudience;
  content: string;
  parent_id: null | string; // null khi là tweet gốc
  hashtags: string[];
  mentions: string[]; // nhắc đến
  media: IMedia | null;
  guest_view: number;
  user_view: number;

  //
  community_id: null | string;

  //
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  retweets_count?: number;
  quotes_count?: number;
  isLike?: boolean;
  isBookmark?: boolean;
  retweet?: string; // id retWeet của tôi
  quote?: string; // // id quoteTweet của tôi
  total_views?: number;
}
