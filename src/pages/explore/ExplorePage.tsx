import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { SearchMain } from "~/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { ForYouTab } from "./for-you-tab/ForYouTab";

export function ExplorePage() {
  const [searchVal, setSearchVal] = useState("");

  return (
    <div>
      <div className="px-4 pt-2 flex items-center gap-3">
        {searchVal && (
          <WrapIcon onClick={() => setSearchVal("")}>
            <ArrowLeftIcon />
          </WrapIcon>
        )}
        <SearchMain
          size="lg"
          // suggestions={[
          //   { id: "1", label: "liem 1" },
          //   { id: "1", label: "liem 2" },
          // ]}
          value={searchVal}
          onClear={() => setSearchVal("")}
          onChange={setSearchVal}
        />
      </div>

      <div className="overflow-y-auto mt-1 h-[calc(100vh-80px)]">
        <Tabs defaultValue="for-you" className="mb-12">
          <div className="bg-white p-2 pt-5 px-4 sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger className="cursor-pointer" value="for-you">
                Dành cho bạn
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="replies">
                Xu hướng
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="highlights">
                Tin tức
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="articles">
                Thể thao
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="media">
                Giải trí
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-4 pt-0">
            {/*  */}
            <ForYouTab />

            {/*  */}
            <TabsContent value="replies" className="px-0 py-4">
              <div className="space-y-4">
                <p>Replies content here...</p>
                {Array.from({ length: 15 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Reply {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/*  */}
            <TabsContent value="highlights" className="px-0 py-4">
              <div className="space-y-4">
                <p>Highlights content here...</p>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Highlight {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/*  */}
            <TabsContent value="articles" className="px-0 py-4">
              <div className="space-y-4">
                <p>Articles content here...</p>
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Article {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/*  */}
            <TabsContent value="media" className="px-0 py-4">
              <div className="space-y-4">
                <p>Media content here...</p>
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Media {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
