import { Link } from "react-router-dom";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { ShortInfoProfile } from "../ShortInfoProfile";

export function Content({
  content,
  mentions,
}: {
  content: string;
  mentions: IUser[];
}) {
  return content.split(/([@#][\w.]+)/g).map((part, i) => {
    // check mention
    if (part.startsWith("@")) {
      const mention = mentions.find((m) => m?.username === part);
      return (
        <ShortInfoProfile
          key={i}
          profile={mention as IUser}
          isInfor
          className="inline"
        >
          <Link
            to={`/${mention?.username}`}
            className="flex items-center gap-2"
          >
            <span className="text-blue-400 font-semibold hover:underline hover:cursor-pointer mb-2 inline-block">
              {mention?.username}
            </span>
          </Link>
        </ShortInfoProfile>
      );
    }

    // check hashtag

    if (part.startsWith("#")) {
      //
      return (
        <Link
          key={i}
          to={`/hashtag/${part}`}
          className="text-blue-400 font-medium hover:underline hover:cursor-pointer"
        >
          {part}
        </Link>
      );
    }

    // text thường
    return part;
  });
}
