import type { IBase } from "./base.interface";

export interface ILike extends IBase {
  user_id: string;
  tweet_id: string;
}
