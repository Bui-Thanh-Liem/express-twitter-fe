import { Link } from "react-router-dom";
import { ETweetType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { formatTimeAgo } from "~/utils/formatTimeAgo";
import { VerifyIcon } from "../icons/verify";
import { AvatarMain } from "../ui/avatar";
import { DialogMain } from "../ui/dialog";
import { Tweet } from "../tweet/tweet";

export function ActionCommentTweet({
  tweet,
  isOpen,
  setOpen,
}: {
  tweet: ITweet;
  isOpen: boolean;
  setOpen: (val: boolean) => void;
}) {
  const { content, user_id, created_at } = tweet;
  const author = user_id as IUser;

  if (!isOpen) return null;

  return (
    <DialogMain isLogo={false} open={isOpen} onOpenChange={setOpen}>
      {/* Header với thông tin người dùng */}
      <div className="flex mb-3 relative">
        <AvatarMain
          src={author.avatar}
          alt={author.name}
          className="mr-3 mt-1"
        />
        <div>
          <Link to={`/${author.username}`} className="flex items-center gap-2">
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
            <p className="text-gray-800 my-3 leading-relaxed">{content}</p>
          )}
        </div>
        <div className="w-0.5 h-20 bg-gray-300 absolute bottom-0 left-5" />
      </div>

      <Tweet
        tweet={tweet}
        key={tweet._id}
        contentBtn="Bình luận"
        tweetType={ETweetType.Comment}
        placeholder="Đăng bình luận của bạn"
        onSuccess={() => setOpen(false)}
      />
    </DialogMain>
  );
}
