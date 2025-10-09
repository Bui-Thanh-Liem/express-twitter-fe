import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { WrapIcon } from "~/components/wrapIcon";
import { useTrendingStore } from "~/store/useTrendingStore";
import { formatTimeAgo } from "~/utils/formatTimeAgo";

export function TrendingPage() {
  const navigate = useNavigate();
  const { trendingItem } = useTrendingStore();
  const highlight = trendingItem?.highlight;

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-4">
          <WrapIcon onClick={() => navigate(-1)}>
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Thịnh hành</p>
        </div>
      </div>

      {/*  */}
      <div className="overflow-y-auto mt-1h-[calc(100vh-80px)]">
        <ul className="my-3 px-8 space-y-3 list-disc">
          {highlight?.map((h, i) => (
            <li key={h._id}>
              <p>
                {h.content}
                <Avatar
                  key={`${h.avatar}-${i}`}
                  className="inline-block ml-4 w-5 h-5"
                >
                  <AvatarImage src={h.avatar} alt={h.content} />
                  <AvatarFallback>{h.avatar}</AvatarFallback>
                </Avatar>
                <span className="text-xs ml-2 text-gray-400">
                  {formatTimeAgo(h.created_at as unknown as string)}
                </span>
              </p>
            </li>
          ))}
        </ul>
        <hr />
      </div>
    </div>
  );
}
