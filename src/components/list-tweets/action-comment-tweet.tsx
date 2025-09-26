import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ETweetType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { formatTimeAgo } from "~/utils/formatTimeAgo";
import { VerifyIcon } from "../icons/verify";
import { Tweet } from "../tweet/Tweet";
import { AvatarMain } from "../ui/avatar";
import { DialogMain } from "../ui/dialog";
import { Content } from "./content";

export function ActionCommentTweet({ tweet }: { tweet: ITweet }) {
  const [isOpen, setIsOpen] = useState(false);
  const { content, user_id, created_at, mentions, comments_count } = tweet;
  const author = user_id as IUser;

  return (
    <>
      <button
        className="flex items-center space-x-2 hover:text-blue-500 transition-colors group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
          <MessageCircle size={18} />
        </div>
        <span className="text-sm">{comments_count || 0}</span>
      </button>

      <DialogMain isLogo={false} open={isOpen} onOpenChange={setIsOpen}>
        {/* Header với thông tin người dùng */}
        <div className="flex mb-3 relative">
          <AvatarMain
            src={author.avatar}
            alt={author.name}
            className="mr-3 mt-1 z-20"
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
              {author.username} •{" "}
              {formatTimeAgo(created_at as unknown as string)}
            </p>

            {/* Nội dung tweet */}
            {content && (
              <div className="my-3">
                <Content content={content} mentions={mentions} />
              </div>
            )}
          </div>
          <div className="w-0.5 h-20 bg-gray-300 absolute bottom-0 left-5 z-10" />
        </div>

        <Tweet
          tweet={tweet}
          key={tweet._id}
          contentBtn="Bình luận"
          tweetType={ETweetType.Comment}
          placeholder="Đăng bình luận của bạn"
          onSuccess={() => setIsOpen(false)}
        />
      </DialogMain>
    </>
  );
}
