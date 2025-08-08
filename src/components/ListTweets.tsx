import {
  BarChart3,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";
import { HLSPlayer } from "~/components/hls/HLSPlayer";
import { useGetNewFeeds } from "~/hooks/useFetchTweet";
import { EFeedType, EMediaType } from "~/shared/enums/type.enum";
import type { IMedia } from "~/shared/interfaces/common/media.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

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

// Component cho từng Tweet item
const TweetItem = ({ tweet, index }: { tweet: ITweet; index: number }) => {
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

  return (
    <div key={_id || index} className="mb-6">
      {/* Header với thông tin người dùng */}
      <div className="flex items-center mb-3">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
            {author.name}
          </h3>
          <p className="text-sm text-gray-500">
            @{author.username} •
            {created_at
              ? new Date(created_at).toLocaleDateString("vi-VN")
              : "Vừa xong"}
          </p>
        </div>
      </div>

      {/* Nội dung tweet */}
      {content && (
        <p className="text-gray-800 mb-3 leading-relaxed">{content}</p>
      )}

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
        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group cursor-pointer">
          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
            <MessageCircle size={18} />
          </div>
          <span className="text-sm">{comments_count || 0}</span>
        </button>

        {/* Retweets */}
        <button
          className={`flex items-center space-x-2 transition-colors group cursor-pointer ${
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
  );
};

// Loading skeleton component
const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
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

export const FollowingListTweets = ({ feedType }: { feedType: EFeedType }) => {
  console.log("FollowingListTweets - feedType::", feedType);

  const { data, isLoading, error } = useGetNewFeeds(feedType, {
    page: "1",
    limit: "30",
  });

  console.log("data:::", data);

  // Lấy danh sách tweets từ response
  const tweets = (data?.data?.items || []) as ITweet[];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">
        👥 Nội dung từ người bạn theo dõi
      </h2>

      {/* Loading state */}
      {isLoading && <LoadingSkeleton />}

      {/* Error state */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">❌ Có lỗi xảy ra khi tải dữ liệu</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && tweets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">📭 Chưa có nội dung nào</p>
          <p className="text-gray-400">
            Hãy theo dõi thêm người dùng để xem nội dung của họ!
          </p>
        </div>
      )}

      {/* Tweets list */}
      {!isLoading && !error && tweets.length > 0 && (
        <div className="space-y-6">
          {tweets.map((tweet, index: number) => (
            <>
              <TweetItem key={tweet._id || index} tweet={tweet} index={index} />
              {index < tweets.length - 1 && <hr className="border-gray-200" />}
            </>
          ))}
        </div>
      )}
    </div>
  );
};
