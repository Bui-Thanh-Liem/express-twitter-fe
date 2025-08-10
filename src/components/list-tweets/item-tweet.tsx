import {
  BarChart3,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EMediaType, ETweetType } from "~/shared/enums/type.enum";
import type { IMedia } from "~/shared/interfaces/common/media.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { HLSPlayer } from "../hls/HLSPlayer";
import { VerifyIcon } from "../icons/verify";
import { Tweet } from "../tweet/tweet";
import { AvatarMain } from "../ui/avatar";
import { DialogMain } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Utility function để format thời gian
const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "Vừa xong";

  const now = new Date();
  const createdDate = new Date(dateString);
  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Kiểm tra xem có cùng ngày không
  const isSameDay = now.toDateString() === createdDate.toDateString();

  if (isSameDay) {
    // Trong ngày - hiện giờ
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes < 1) return "Vừa xong";
      return `${diffInMinutes}p`;
    }
    return `${diffInHours}h`;
  } else {
    // Qua ngày - hiện ngày
    if (diffInDays === 1) {
      return "Hôm qua";
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày`;
    } else {
      return createdDate.toLocaleDateString("vi-VN");
    }
  }
};

// Component cho Media (Image hoặc Video)
const MediaContent = ({ url, type }: IMedia) => {
  if (!url) {
    return (
      <div className="w-full aspect-video rounded-lg shadow overflow-hidden mb-6 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Không có media</p>
      </div>
    );
  }

  return (
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
  );
};

export const TweetItem = ({
  tweet,
  index,
}: {
  tweet: ITweet;
  index: number;
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
    quote_count,
    guest_view,
    isBookmark,
    retweet_count,
    comments_count,
  } = tweet;

  const author = user_id as IUser;
  const [isOpenComment, setOpenComment] = useState(false);

  return (
    <>
      {/*  */}
      <div key={_id || index} className="mb-6">
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
        {hashtags.length && (
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`outline-0 flex items-center space-x-2 transition-colors group cursor-pointer ${
                  1 === 1 ? "text-green-500" : "hover:text-green-500"
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                  <Repeat2 size={18} />
                </div>
                <span className="text-sm">
                  {(retweet_count || 0) + (quote_count || 0)}
                </span>
              </button>
            </DropdownMenuTrigger>

            {/*  */}
            <DropdownMenuContent
              side="bottom"
              align="center"
              className="rounded-2xl w-48 px-0 py-2"
            >
              <DropdownMenuItem className="cursor-pointer h-10 px-3">
                Đăng lại
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer h-10 px-3">
                Đăng lại thêm trích dẫn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

          {/* Actions */}
          <div className="flex items-center space-x-1">
            <button
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isBookmark
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
              }`}
            >
              <Bookmark size={18} fill={isBookmark ? "currentColor" : "none"} />
            </button>

            <button className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Comment */}
      <DialogMain
        isLogo={false}
        open={isOpenComment}
        onOpenChange={setOpenComment}
      >
        {/* Header với thông tin người dùng */}
        <div className="flex mb-3 relative">
          <AvatarMain
            src={author.avatar}
            alt={author.name}
            className="mr-3 mt-1"
          />
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

            {/* Nội dung tweet */}
            {content && (
              <p className="text-gray-800 my-3 leading-relaxed">{content}</p>
            )}
          </div>
          <div className="w-0.5 h-20 bg-gray-300 absolute bottom-0 left-5" />
        </div>

        <Tweet
          parent_id={tweet._id}
          contentBtn="Bình luận"
          tweetType={ETweetType.Comment}
          placeholder="Đăng bình luận của bạn"
          onSuccess={() => setOpenComment(false)}
        />
      </DialogMain>
    </>
  );
};
