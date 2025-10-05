import { TabsContent } from "~/components/ui/tabs";
import { OutstandingThisWeek } from "./OutstandingThisWeek";
import { TodayNews } from "./TodayNews";
import { WhoToFollows } from "./WhoToFollows";

export function ForYouTab() {
  return (
    <TabsContent value="for-you" className="px-0 pb-4">
      <TodayNews />
      <OutstandingThisWeek />
      <WhoToFollows />
    </TabsContent>
  );
}
