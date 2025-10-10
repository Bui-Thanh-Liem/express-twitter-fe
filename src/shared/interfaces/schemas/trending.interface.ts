import type { IBase } from "./base.interface";

export interface ITrending extends IBase {
  topic?: string;
  slug?: string;
  hashtag?: string;
  count: number;
}
