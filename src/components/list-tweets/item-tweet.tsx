import { BarChart3, Flag, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  useDeleteTweet,
  useGetDetailTweet,
} from "~/hooks/useFetchTweet";
import { cn } from "~/lib/utils";
import { EMediaType, ETweetType } from "~/shared/enums/type.enum";
import type { IMedia } from "~/shared/interfaces/common/media.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useDetailTweetStore } from "~/store/useDetailTweetStore";
import { useUserStore } from "~/store/useUserStore";
import { formatTimeAgo } from "~/utils/formatTimeAgo";
import { handleResponse } from "~/utils/handleResponse";
import { HLSPlayer } from "../hls/HLSPlayer";
import { DotIcon } from "../icons/dot";
import { VerifyIcon } from "../icons/verify";
import { ShortInfoProfile } from "../ShortInfoProfile";
import { AvatarMain } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { WrapIcon } from "../wrapIcon";
import { ActionBookmarkTweet } from "./action-bookmark-tweet";
import { ActionCommentTweet } from "./action-comment-tweet";
import { ActionLikeTweet } from "./action-like-tweet";
import { ActionRetweetQuoteTweet } from "./action-retweet-quote-tweet";
import { ActionShared } from "./action-shared";
import { Content } from "./content";
import { useReportTweet } from "~/hooks/useFetchReport";

// Component cho Media (Image hoặc Video)
export const MediaContent = ({
  url,
  type,
  tweet,
}: IMedia & { tweet?: ITweet }) => {
  //
  const { open, setTweet } = useDetailTweetStore();

  //
  function handleClickMedia() {
    open();
    if (tweet) {
      setTweet(tweet);
      toast.info("Nhấn 2 lần vào điểm bất kì để đóng ", {
        position: "top-center",
        richColors: true,
        duration: 2000,
      });
    }
  }

  if (!url) return <></>;

  return (
    <div
      className={cn(
        "w-full h-full aspect-video rounded-lg overflow-hidden mb-6 bg-gray-50",
        tweet ? "cursor-pointer" : ""
      )}
      onClick={handleClickMedia}
    >
      {type === EMediaType.Video ? (
        <HLSPlayer src={url} />
      ) : type === EMediaType.Image ? (
        <img
          src={url}
          alt={url}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-image.png"; // Fallback image
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-400">Định dạng media không hỗ trợ</p>
        </div>
      )}
    </div>
  );
};

//
export const SkeletonTweet = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="animate-pulse px-4 py-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 my-3"></div>
          <div className="w-full aspect-video bg-gray-200 rounded-lg mb-4"></div>
          <div className="flex space-x-6">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

//
export const TweetItem = ({
  tweet,
  isAction = true,
  onSuccessDel,
}: {
  tweet: ITweet;
  isAction?: boolean;
  onSuccessDel: (id: string) => void;
}) => {
  const {
    _id,
    media,
    content,
    user_id,
    mentions,
    user_view,
    parent_id,
    created_at,
    guest_view,
  } = tweet;

  const author = user_id as unknown as IUser;

  // Gọi api detail để lấy các retweet/quoteTweet
  const { data } = useGetDetailTweet(parent_id || "");

  //
  const quoteTweet = data?.data ? data?.data : ({} as ITweet);
  const quoteTweet_user = quoteTweet.user_id as unknown as IUser;

  return (
    <div key={_id} className="px-4 py-2 group hover:bg-gray-50">
      {/* Header với thông tin người dùng */}
      <div className="flex items-center mb-3">
        <AvatarMain src={author.avatar} alt={author.name} className="mr-3" />
        <div>
          <ShortInfoProfile profile={tweet.user_id as unknown as IUser}>
            <Link
              to={`/${author.username}`}
              className="flex items-center gap-2"
            >
              <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
                {author.name}
              </h3>
              <VerifyIcon active={!!author.verify} size={20} />
            </Link>
          </ShortInfoProfile>
          <p className="text-sm text-gray-500">
            {author.username} • {formatTimeAgo(created_at as unknown as string)}
          </p>
        </div>
        <div className="ml-auto">
          <TweetAction tweet={tweet} onSuccessDel={onSuccessDel} />
        </div>
      </div>

      <div className="ml-14">
        {/* Nội dung tweet */}
        {content && tweet.type !== ETweetType.Retweet && (
          <p className="text-gray-800 mb-3 leading-relaxed">
            <Content content={content} mentions={mentions as any} />
          </p>
        )}

        {/* Media content */}
        {tweet.type !== ETweetType.Retweet && (
          <MediaContent
            tweet={tweet}
            url={media?.url || ""}
            type={media?.type || EMediaType.Image}
          />
        )}

        {/* QuoteTweet and Retweet */}
        {tweet.type === ETweetType.QuoteTweet ||
        tweet.type === ETweetType.Retweet ? (
          <div className="border border-gray-300 rounded-2xl p-3 pb-0">
            {/* Header với thông tin người dùng */}
            <div className="flex items-center mb-3">
              <AvatarMain
                src={quoteTweet_user?.avatar}
                alt={quoteTweet_user?.name}
                className="mr-3"
              />
              <div>
                <ShortInfoProfile profile={quoteTweet_user}>
                  <Link
                    to={`/${quoteTweet_user?.username}`}
                    className="flex items-center gap-2"
                  >
                    <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
                      {quoteTweet_user?.name}
                    </h3>
                    <VerifyIcon active={!!quoteTweet_user?.verify} size={20} />
                  </Link>
                </ShortInfoProfile>
                <p className="text-sm text-gray-500">
                  {quoteTweet_user?.username} •{" "}
                  {formatTimeAgo(quoteTweet.created_at as unknown as string)}
                </p>
              </div>
            </div>

            {/* Nội dung tweet */}
            {quoteTweet?.content && (
              <p className="text-gray-800 mb-3 leading-relaxed">
                <Content
                  content={quoteTweet?.content}
                  mentions={quoteTweet?.mentions as unknown as IUser[]}
                />
              </p>
            )}

            {/* Media content */}
            <MediaContent
              tweet={quoteTweet}
              url={quoteTweet.media?.url || ""}
              type={quoteTweet.media?.type || EMediaType.Image}
            />
          </div>
        ) : null}

        {/* Engagement Bar */}
        {isAction && (
          <div className="flex items-center justify-between text-gray-500 border-t border-gray-100 pt-3">
            {/* Comment */}
            <ActionCommentTweet tweet={tweet} />

            {/* Retweet and Quote */}
            <ActionRetweetQuoteTweet tweet={tweet} />

            {/* Likes */}
            <ActionLikeTweet tweet={tweet} />

            {/* Views */}
            <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <BarChart3 size={18} />
              </div>
              <span className="text-sm">{user_view + guest_view}</span>
            </button>

            {/* Bookmark and Shared */}
            <div className="flex items-center space-x-1">
              <ActionBookmarkTweet tweet={tweet} />
              <ActionShared tweet={tweet} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

//
function TweetAction({
  tweet,
  onSuccessDel,
}: {
  tweet: ITweet;
  onSuccessDel: (id: string) => void;
}) {
  const { user } = useUserStore();
  const author = tweet?.user_id as unknown as IUser;
  const apiDeleteTweet = useDeleteTweet();
  const apiReportTweet = useReportTweet();

  // Gỡ bài viết (xoá)
  async function onDel() {
    const resDeleted = await apiDeleteTweet.mutateAsync(tweet._id);
    handleResponse(resDeleted, () => {
      onSuccessDel(tweet._id);
    });
  }

  // Báo cáo bài viết
  async function onReport() {
    const resDeleted = await apiReportTweet.mutateAsync(tweet._id);
    handleResponse(resDeleted, () => {
      onSuccessDel(tweet._id);
    });
  }

  return (
    <div className="relative">
      <div className="relative w-16 h-6 flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 flex items-center justify-end rounded-full outline-0
                     opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
                     transition-opacity duration-150"
            >
              <WrapIcon>
                <DotIcon size={16} />
              </WrapIcon>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="right"
            sideOffset={6}
            className="rounded-2xl px-0"
          >
            {user?._id === author?._id ? (
              <DropdownMenuItem
                className="cursor-pointer px-3 font-semibold space-x-1"
                onClick={onDel}
              >
                <Trash className="w-3 h-3" color="var(--color-red-400)" />
                <p className="text-red-400 text-sm">Gỡ bài viết</p>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer px-3 font-semibold space-x-1"
                onClick={onReport}
              >
                <Flag className="w-3 h-3" color="var(--color-red-400)" />
                <p className="text-red-400 text-sm">Báo cáo</p>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
