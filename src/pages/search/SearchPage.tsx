import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { SearchAdvanced } from "~/components/search-advanced/search-advanced";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { PeopleTab } from "./PeopleTab";
import { TopTab } from "./TopTab";
import { TweetTab } from "./TweetTab";

export function SearchPage() {
  const [searchVal, setSearchVal] = useState("");

  return (
    <div>
      <div className="px-4 pt-2 flex items-center gap-3">
        {searchVal && (
          <WrapIcon onClick={() => setSearchVal("")}>
            <ArrowLeftIcon />
          </WrapIcon>
        )}
        <SearchAdvanced
          size="lg"
          onChange={setSearchVal}
          className="w-[580px]"
          placeholder="bui_thanh_liem, #developer, devops engineer"
        />
      </div>

      <div className="mt-1">
        <Tabs defaultValue="top" className="mb-12">
          <div className="bg-white p-2 pt-5 px-4 sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger className="cursor-pointer" value="top">
                Tìm kiếm hàng đầu
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="people">
                Mọi người
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="tweet">
                Bài viết
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="media">
                Hình ảnh/video
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-4 pt-0">
            <TopTab />
            <TweetTab />
            <PeopleTab />
          </div>
        </Tabs>
      </div>
    </div>
  );
}
