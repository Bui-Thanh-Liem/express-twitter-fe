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
          isInfor
          key={i}
          profile={mention as IUser}
          className="inline"
        >
          <Link
            to={`/${mention?.username}`}
            className="items-center gap-2 inline"
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
          to={`/search?q=${part.replace("#", "")}`}
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
