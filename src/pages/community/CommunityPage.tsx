import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { CreateGroupIcon } from "~/components/icons/create-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { JoinedTab } from "./joined-tab/JoinedTab";

export function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-4">
          <WrapIcon onClick={() => navigate(-1)}>
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Cộng đồng</p>
        </div>
        <WrapIcon className="p-1.5">
          <CreateGroupIcon size={26} />
        </WrapIcon>
      </div>

      {/*  */}
      <div>
        <Tabs defaultValue="joined" className="mb-12">
          <div className="sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value="joined"
              >
                <span>Đã tham gia</span>
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value="explore"
              >
                <span>Khám phá</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-4 pt-0 overflow-y-auto h-[calc(100vh-100px)]">
            <TabsContent value="joined" className="py-4">
              <JoinedTab />
            </TabsContent>
            <TabsContent value="explore" className="py-4"></TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
