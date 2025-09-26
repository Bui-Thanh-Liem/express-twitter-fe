import { BarChart3, MessageCircle, Share } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetDetailTweet } from "~/hooks/useFetchTweet";
import { EMediaType, ETweetType } from "~/shared/enums/type.enum";
import type { IMedia } from "~/shared/interfaces/common/media.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { formatTimeAgo } from "~/utils/formatTimeAgo";
import { HLSPlayer } from "../hls/HLSPlayer";
import { VerifyIcon } from "../icons/verify";
import { ShortInfoProfile } from "../ShortInfoProfile";
import { AvatarMain } from "../ui/avatar";
import { ActionBookmarkTweet } from "./action-bookmark-tweet";
import { ActionCommentTweet } from "./action-comment-tweet";
import { ActionLikeTweet } from "./action-like-tweet";
import { ActionRetweetQuoteTweet } from "./action-retweet-quote-tweet";
import { Content } from "./content";
import { TweetDetailDrawer } from "./tweet-detail-drawer";

// Component cho Media (Image hoặc Video)
export const MediaContent = ({
  url,
  type,
  tweet,
}: IMedia & { tweet?: ITweet }) => {
  if (!url) return null;
  return (
    <TweetDetailDrawer tweet={tweet ? tweet : undefined}>
      <div className="w-full h-full aspect-video rounded-lg overflow-hidden mb-6 cursor-pointer">
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
    </TweetDetailDrawer>
  );
};

export const TweetItem = ({
  tweet,
  isAction = true,
}: {
  tweet: ITweet;
  isAction?: boolean;
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
    comments_count,
  } = tweet;

  const author = user_id as IUser;
  const { data } = useGetDetailTweet(parent_id);
  const quoteTweet = data?.data ? data?.data : ({} as ITweet);
  const [isOpenComment, setOpenComment] = useState(false);

  return (
    <>
      <div key={_id} className="px-4 py-2 hover:bg-gray-50">
        {/* Header với thông tin người dùng */}
        <div className="flex items-center mb-3">
          <AvatarMain src={author.avatar} alt={author.name} className="mr-3" />
          <div>
            <ShortInfoProfile profile={tweet.user_id as IUser}>
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
              {author.username} •{" "}
              {formatTimeAgo(created_at as unknown as string)}
            </p>
          </div>
        </div>

        <div className="ml-14">
          {/* Nội dung tweet */}
          {content && tweet.type !== ETweetType.Retweet && (
            <p className="text-gray-800 mb-3 leading-relaxed">
              <Content content={content} mentions={mentions} />
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
                  src={quoteTweet.user_id?.avatar}
                  alt={quoteTweet.user_id?.name}
                  className="mr-3"
                />
                <div>
                  <ShortInfoProfile profile={quoteTweet.user_id}>
                    <Link
                      to={`/${quoteTweet.user_id?.username}`}
                      className="flex items-center gap-2"
                    >
                      <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
                        {quoteTweet.user_id?.name}
                      </h3>
                      <VerifyIcon
                        active={!!quoteTweet.user_id?.verify}
                        size={20}
                      />
                    </Link>
                  </ShortInfoProfile>
                  <p className="text-sm text-gray-500">
                    {quoteTweet.user_id?.username} •{" "}
                    {formatTimeAgo(quoteTweet.created_at as unknown as string)}
                  </p>
                </div>
              </div>

              {/* Nội dung tweet */}
              {quoteTweet?.content && (
                <p className="text-gray-800 mb-3 leading-relaxed">
                  <Content
                    content={quoteTweet?.content}
                    mentions={quoteTweet?.mentions}
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
              {/* Comments */}
              <button
                className="flex items-center space-x-2 hover:text-blue-500 transition-colors group cursor-pointer"
                onClick={() => setOpenComment(!isOpenComment)}
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <MessageCircle size={18} />
                </div>
                <span className="text-sm">{comments_count || 0}</span>
              </button>

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
                <button className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                  <Share size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comment */}
      <ActionCommentTweet
        tweet={tweet}
        isOpen={isOpenComment}
        setOpen={setOpenComment}
      />
    </>
  );
};
