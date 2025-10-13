import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { ENotificationType } from "~/shared/enums/type.enum";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { TabContent } from "./TabContent";

export function NotificationPage() {
  //
  const navigate = useNavigate();

  //
  const { unreadByType } = useUnreadNotiStore();

  const [unreadNoti, setUnreadNoti] = useState<Record<
    ENotificationType,
    number
  > | null>(null);

  //
  useEffect(() => {
    setUnreadNoti(unreadByType);
  }, [unreadByType]);

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-6 ">
          <WrapIcon onClick={() => navigate(-1)} aria-label="Quay lại">
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Thông báo</p>
        </div>
      </div>

      {/*  */}
      <div className="mt-1">
        <Tabs defaultValue={ENotificationType.VERIFY} className="mb-12">
          <div className="bg-white p-2 pt-5 px-4 sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={ENotificationType.VERIFY}
              >
                <span>Xác thực</span>
                {unreadNoti && unreadNoti[ENotificationType.VERIFY] && (
                  <p className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-sky-400 rounded-full">
                    {unreadNoti[ENotificationType.VERIFY]}
                  </p>
                )}
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={ENotificationType.REVIEW}
              >
                <span>Kiểm duyệt</span>
                {unreadNoti && unreadNoti[ENotificationType.REVIEW] && (
                  <div className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-sky-400 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={ENotificationType.MENTION_LIKE}
              >
                <span>Nhắc đến</span>
                {unreadNoti && unreadNoti[ENotificationType.MENTION_LIKE] && (
                  <p className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-sky-400 rounded-full">
                    {unreadNoti[ENotificationType.MENTION_LIKE]}
                  </p>
                )}
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={ENotificationType.FOLLOW}
              >
                <span>Theo dõi</span>
                {unreadNoti && unreadNoti[ENotificationType.FOLLOW] && (
                  <div className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-sky-400 rounded-full" />
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-4 pt-0 overflow-y-auto h-[calc(100vh-100px)]">
            <TabsContent value={ENotificationType.VERIFY} className="px-0 py-4">
              <TabContent
                type={ENotificationType.VERIFY}
                key={ENotificationType.VERIFY}
                emptyText="Thông báo về xác thực tài khoản của bạn có hợp lệ không."
              />
            </TabsContent>
            <TabsContent value={ENotificationType.REVIEW} className="px-0 py-4">
              <TabContent
                type={ENotificationType.REVIEW}
                key={ENotificationType.REVIEW}
                emptyText="Chúng tôi sẽ thông báo cho bạn về video bạn đăng có vi phạm chính sách hay không."
              />
            </TabsContent>
            <TabsContent
              value={ENotificationType.MENTION_LIKE}
              className="px-0 py-4"
            >
              <TabContent
                type={ENotificationType.MENTION_LIKE}
                key={ENotificationType.MENTION_LIKE}
                emptyText="Từ lượt thích đến lượt đăng lại và nhiều hơn thế nữa, đây chính là nơi diễn ra mọi hoạt động."
              />
            </TabsContent>
            <TabsContent value={ENotificationType.FOLLOW} className="px-0 py-4">
              <TabContent
                type={ENotificationType.FOLLOW}
                key={ENotificationType.FOLLOW}
                emptyText="Những ai đang theo dõi bạn, đây chính là nơi diễn ra mọi hoạt động."
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
