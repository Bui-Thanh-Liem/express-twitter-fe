import type { IBase } from "./base.interface";

export interface IBookmark extends IBase {
  user_id: string;
  tweet_id: string;
}
