import { TabsContent } from "~/components/ui/tabs";
import { TodayNews } from "./TodayNews";
import { WhatHappen } from "./WhatHappen";
import { WhoToFollows } from "./WhoToFollows";

export function ForYouTab() {
  return (
    <TabsContent value="for-you" className="px-0 pb-4">
      <TodayNews />
      <WhatHappen />
      <WhoToFollows />
    </TabsContent>
  );
}
