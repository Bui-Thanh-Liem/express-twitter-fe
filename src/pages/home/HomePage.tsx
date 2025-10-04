import { useState } from "react";
import { TypographyP } from "~/components/elements/p";
import { cn } from "~/lib/utils";
import { EFeedType, ETweetType } from "~/shared/enums/type.enum";
import { ListTweets } from "../../components/list-tweets/list-tweets";
import { Tweet } from "../../components/tweet/Tweet";

export function HomePage() {
  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<EFeedType>(EFeedType.All);

  const classNav =
    "flex-1 h-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 font-semibold transition-colors relative";
  const classActive =
    "text-black font-bold after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-26 after:h-1 after:rounded-full after:bg-[#1D9BF0]";

  return (
    <main className="relative h-screen flex flex-col">
      {/* Fixed Navigation Bar */}
      <div className="h-14 bg-white/50 backdrop-blur-md z-30 flex border-b border-gray-200 flex-shrink-0">
        <div className="flex w-full h-full">
          <TypographyP
            className={cn(classNav, activeTab === EFeedType.All && classActive)}
            onClick={() => setActiveTab(EFeedType.All)}
          >
            Dành Cho Bạn
          </TypographyP>
          <TypographyP
            className={cn(
              classNav,
              activeTab === EFeedType.Following && classActive
            )}
            onClick={() => setActiveTab(EFeedType.Following)}
          >
            Đã Theo Dõi
          </TypographyP>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pt-4">
        <Tweet key={ETweetType.Tweet} />
      </div>
      <div className="border-b border-gray-200" />

      <div className="flex-1 overflow-y-auto">
        {/* <div className="px-4 pt-4">
          <Tweet key={ETweetType.Tweet} />
        </div>
        <div className="border-b border-gray-200" /> */}
        <ListTweets feedType={activeTab} />
      </div>
    </main>
  );
}
