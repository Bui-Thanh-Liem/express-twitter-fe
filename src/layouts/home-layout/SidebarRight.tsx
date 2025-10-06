import { useLocation } from "react-router-dom";
import { OutstandingThisWeekCard } from "~/components/outstanding-this-week/outstanding-this-week-card";
import { SearchAdvanced } from "~/components/search-advanced/search-advanced";
import { SearchFilterCard } from "~/components/search-advanced/search-filter-card";
import { TodayNewsCard } from "~/components/today-news/today-news-card";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { WhoToFollowCard } from "~/components/who-to-follow/who-to-follow-card";

export function SidebarRight() {
  const { pathname } = useLocation();

  const isHiddenSearch = pathname === "/explore" || pathname === "/search";

  return (
    <div className="px-4">
      <div className="mb-4 mt-2">
        {!isHiddenSearch ? (
          <SearchAdvanced
            size="lg"
            className="w-[300px]"
            placeholder="bui_thanh_liem, #developer"
          />
        ) : (
          <>
            <Card className="py-2 mb-4">
              <CardHeader className="px-4">
                <CardTitle className="text-xl">Bộ lọc tìm kiếm</CardTitle>
              </CardHeader>
            </Card>
            <SearchFilterCard />
          </>
        )}
      </div>

      <div className="space-y-4 max-h-[88vh] overflow-y-auto">
        <TodayNewsCard />
        <OutstandingThisWeekCard />
        <WhoToFollowCard />
      </div>
    </div>
  );
}
