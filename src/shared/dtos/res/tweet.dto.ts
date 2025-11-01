import type { EFeedTypeItem } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export type ResCreateTweet = {
  acknowledged: boolean;
  insertedId: string;
};

export type ResNewFeeds = {
  type: EFeedTypeItem;
  items: ITweet[] | ICommunity[];
};
