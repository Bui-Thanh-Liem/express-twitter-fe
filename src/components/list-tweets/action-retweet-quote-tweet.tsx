import { Repeat2, SquarePen } from "lucide-react";
import { useState } from "react";
import { useCreateTweet } from "~/hooks/useFetchTweet";
import type { CreateTweetDto } from "~/shared/dtos/req/tweet.dto";
import { ETweetType } from "~/shared/enums/type.enum";
import type { IHashtag } from "~/shared/interfaces/schemas/hashtag.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { handleResponse } from "~/utils/handleResponse";
import { Tweet } from "../tweet/Tweet";
import { DialogMain } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ActionRetweetQuoteTweet({ tweet }: { tweet: ITweet }) {
  const { retweets_count, quotes_count, isRetweet, isQuote } = tweet;
  const apiCreateTweet = useCreateTweet();
  const [isOpenQuote, setIsOpenQuote] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //
  async function onRetweet() {
    const hashtags = tweet?.hashtags as unknown as IHashtag[];
    const mentions = tweet?.mentions as unknown as IUser[];

    const tweetData: CreateTweetDto = {
      parent_id: tweet._id,
      content: tweet.content,
      hashtags: hashtags?.map((hashtag) => hashtag.name),
      audience: tweet.audience,
      type: ETweetType.Retweet,
      media: tweet.media ? tweet.media : undefined,
      mentions: mentions?.map((mention) => mention._id),
    };
    const resCreateTweet = await apiCreateTweet.mutateAsync(tweetData);
    handleResponse(resCreateTweet);
  }

  //
  function onQuote() {
    setIsOpenQuote(true);
    setIsDropdownOpen(false);
  }

  //
  const count = (retweets_count || 0) + (quotes_count || 0);
  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={`outline-0 flex items-center space-x-2 transition-colors group cursor-pointer ${
              isRetweet || isQuote ? "text-green-500" : "hover:text-green-500"
            }`}
          >
            <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
              <Repeat2 size={18} />
            </div>
            <span className="text-sm">{count}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="center"
          className="rounded-2xl w-60 px-0 py-2"
        >
          <DropdownMenuItem
            className="cursor-pointer h-10 px-3 font-semibold"
            onClick={onRetweet}
          >
            <Repeat2 strokeWidth={2} className="w-6 h-6" color="#000" />
            {isRetweet ? "Xóa bài đăng lại" : "Đăng lại"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer h-10 px-3 font-semibold"
            onClick={onQuote}
          >
            <SquarePen strokeWidth={2} className="w-6 h-6" color="#000" />
            {isQuote
              ? "Xóa Đăng lại thêm trích dẫn"
              : "Đăng lại thêm trích dẫn"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quote */}
      <DialogMain
        width="2xl"
        isLogo={false}
        open={isOpenQuote}
        onOpenChange={setIsOpenQuote}
      >
        <Tweet
          key={ETweetType.QuoteTweet}
          tweet={tweet}
          contentBtn="Đăng"
          tweetType={ETweetType.QuoteTweet}
          placeholder="Đăng bình luận của bạn"
          onSuccess={() => setIsOpenQuote(false)}
        />
      </DialogMain>
    </>
  );
}
