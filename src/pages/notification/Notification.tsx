import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { ENotificationType } from "~/shared/enums/type.enum";
import { TabContent } from "./TabContent";

export function NotificationPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-6 ">
          <WrapIcon onClick={() => navigate(-1)} aria-label="Quay lại">
            <ArrowLeftIcon />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Thông báo</p>
        </div>
      </div>

      {/*  */}
      <div className="overflow-y-auto mt-1 h-[calc(100vh-80px)]">
        <Tabs defaultValue={ENotificationType.ALL} className="mb-12">
          <div className="bg-white p-2 pt-5 px-4 sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer"
                value={ENotificationType.ALL}
              >
                Tất cả
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer"
                value={ENotificationType.VERIFY}
              >
                Xác thực
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer"
                value={ENotificationType.MENTION_LIKE}
              >
                Nhắc đến
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer"
                value={ENotificationType.FOLLOW}
              >
                Theo dõi
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-4 pt-0">
            <TabsContent value={ENotificationType.ALL} className="px-0 py-4">
              <TabContent
                type={ENotificationType.ALL}
                key={ENotificationType.ALL}
              />
            </TabsContent>
            <TabsContent value={ENotificationType.VERIFY} className="px-0 py-4">
              <TabContent
                type={ENotificationType.VERIFY}
                key={ENotificationType.VERIFY}
              />
            </TabsContent>
            <TabsContent
              value={ENotificationType.MENTION_LIKE}
              className="px-0 py-4"
            >
              <TabContent
                type={ENotificationType.MENTION_LIKE}
                key={ENotificationType.MENTION_LIKE}
              />
            </TabsContent>
            <TabsContent value={ENotificationType.FOLLOW} className="px-0 py-4">
              <TabContent
                type={ENotificationType.FOLLOW}
                key={ENotificationType.FOLLOW}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
