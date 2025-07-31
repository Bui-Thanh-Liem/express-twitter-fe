import { useState } from "react";
import { TypographyP } from "~/components/elements/p";
import { cn } from "~/lib/utils";
import { FollowingContent } from "./FollowingContent";
import { ForYouContent } from "./ForYouContent";
import { Tweet } from "./Tweet";

export function HomePage() {
  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you"
  );

  const classNav =
    "flex-1 h-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 font-semibold transition-colors relative";
  const classActive =
    "text-black font-bold after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-26 after:h-1 after:rounded-full after:bg-[#1D9BF0]";

  return (
    <main className="relative h-screen flex flex-col">
      {/* Fixed Navigation Bar */}
      <div className="h-14 bg-white/50 backdrop-blur-md z-50 flex border-b border-gray-200 flex-shrink-0">
        <div className="flex w-full h-full">
          <TypographyP
            className={cn(classNav, activeTab === "for-you" && classActive)}
            onClick={() => setActiveTab("for-you")}
          >
            Dành Cho Bạn
          </TypographyP>
          <TypographyP
            className={cn(classNav, activeTab === "following" && classActive)}
            onClick={() => setActiveTab("following")}
          >
            Đã Theo Dõi
          </TypographyP>
        </div>
      </div>

      {/* Scrollable Content */}
      <Tweet />
      <div className="border-b border-gray-200" />

      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {activeTab === "for-you" ? <ForYouContent /> : <FollowingContent />}
      </div>
    </main>
  );
}
