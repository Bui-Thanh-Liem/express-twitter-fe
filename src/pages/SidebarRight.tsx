import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TodayNewsCard } from "~/components/today-news/today-news-card";
import { SearchMain } from "~/components/ui/search";
import { WhatHappenCard } from "~/components/what-heppen/what-happen-card";
import { WhoToFollowCard } from "~/components/who-to-follow/who-to-follow-card";

export function SidebarRight() {
  const { pathname } = useLocation();
  const [searchVal, setSearchVal] = useState("");
  const isHiddenSearch = pathname === "/explore";

  return (
    <div>
      <div className="px-4">
        <div className="mb-4 mt-2">
          {!isHiddenSearch && (
            <SearchMain
              size="lg"
              value={searchVal}
              onClear={() => setSearchVal("")}
              onChange={setSearchVal}
            />
          )}
        </div>

        <div className="space-y-4 max-h-[86vh] overflow-y-auto pr-2">
          <TodayNewsCard />
          <WhatHappenCard />
          <WhoToFollowCard />
        </div>
      </div>
    </div>
  );
}
