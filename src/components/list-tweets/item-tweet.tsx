import { BarChart3, Bookmark, Heart, MessageCircle, Share } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EMediaType } from "~/shared/enums/type.enum";
import type { IMedia } from "~/shared/interfaces/common/media.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { formatTimeAgo } from "~/utils/formatTimeAgo";
import { HLSPlayer } from "../hls/HLSPlayer";
import { VerifyIcon } from "../icons/verify";
import { AvatarMain } from "../ui/avatar";
import { ActionCommentTweet } from "./action-comment-tweet";
import { ActionRetweetQuoteTweet } from "./action-retweet-quote-tweet";

// Component cho Media (Image hoặc Video)
const MediaContent = ({ url, type }: IMedia) => {
  if (!url) return null;
  return (
    <>
      <div className="w-full aspect-video rounded-lg shadow overflow-hidden mb-6 bg-black">
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
    </>
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
    isLike,
    content,
    user_id,
    hashtags,
    user_view,
    created_at,
    likes_count,
    guest_view,
    isBookmark,
    comments_count,
  } = tweet;

  const author = user_id as IUser;
  const [isOpenComment, setOpenComment] = useState(false);

  return (
    <>
      {/*  */}
      <div key={_id} className="px-4 py-2 hover:bg-gray-50">
        {/* Header với thông tin người dùng */}
        <div className="flex items-center mb-3">
          <AvatarMain src={author.avatar} alt={author.name} className="mr-3" />
          <div>
            <Link
              to={`/${author.username}`}
              className="flex items-center gap-2"
            >
              <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
                {author.name}
              </h3>
              <VerifyIcon active={!!author.verify} size={20} />
            </Link>
            <p className="text-sm text-gray-500">
              @{author.username} •{" "}
              {formatTimeAgo(created_at as unknown as string)}
            </p>
          </div>
        </div>

        {/* Nội dung tweet */}
        {content && (
          <p className="text-gray-800 mb-3 leading-relaxed">{content}</p>
        )}

        {/* Hashtags */}
        {!!hashtags?.length && (
          <div className="flex items-center gap-x-1.5 flex-wrap text-sm">
            {hashtags.map((hashtag) => (
              <span
                className="text-blue-400 font-semibold hover:underline hover:cursor-pointer mb-2 inline-block"
                key={hashtag._id}
              >
                #{hashtag.name}
              </span>
            ))}
          </div>
        )}

        {/* Media content */}
        <MediaContent
          url={media?.url || ""}
          type={media?.type || EMediaType.Image}
        />

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
            <button
              className={`flex items-center space-x-2 transition-colors group cursor-pointer ${
                isLike ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <Heart size={18} fill={isLike ? "currentColor" : "none"} />
              </div>
              <span className="text-sm">{likes_count || 0}</span>
            </button>

            {/* Views */}
            <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <BarChart3 size={18} />
              </div>
              <span className="text-sm">{user_view + guest_view}</span>
            </button>

            {/* Bookmark and Shared */}
            <div className="flex items-center space-x-1">
              <button
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isBookmark
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                }`}
              >
                <Bookmark
                  size={18}
                  fill={isBookmark ? "currentColor" : "none"}
                />
              </button>

              <button className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <Share size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comment */}
      <ActionCommentTweet
        tweet={tweet}
        isOpen={isOpenComment}
        setOpen={setOpenComment}
      />

      {/*  */}
    </>
  );
};
