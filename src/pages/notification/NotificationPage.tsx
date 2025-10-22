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
      <div>
        <Tabs defaultValue={ENotificationType.Verify} className="mb-12">
          <div className="bg-white sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={ENotificationType.Verify}
              >
                <span>Xác thực</span>
                {unreadNoti && unreadNoti[ENotificationType.Verify] && (
                  <p className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-sky-400 rounded-full">
                    {unreadNoti[ENotificationType.Verify]}
                  </p>
                )}
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={ENotificationType.Review}
              >
                <span>Kiểm duyệt</span>
                {unreadNoti && unreadNoti[ENotificationType.Review] && (
                  <div className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-sky-400 rounded-full">
                    {unreadNoti[ENotificationType.Review]}
                  </div>
                )}
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={ENotificationType.Mention_like}
              >
                <span>Nhắc đến / Thích</span>
                {unreadNoti && unreadNoti[ENotificationType.Mention_like] && (
                  <p className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-sky-400 rounded-full">
                    {unreadNoti[ENotificationType.Mention_like]}
                  </p>
                )}
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={ENotificationType.Follow}
              >
                <span>Theo dõi</span>
                {unreadNoti && unreadNoti[ENotificationType.Follow] && (
                  <div className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-sky-400 rounded-full">
                    {unreadNoti[ENotificationType.Follow]}
                  </div>
                )}
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={ENotificationType.Other}
              >
                <span>Khác</span>
                {unreadNoti && unreadNoti[ENotificationType.Other] && (
                  <div className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-sky-400 rounded-full">
                    {unreadNoti[ENotificationType.Other]}
                  </div>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-4 pt-0 overflow-y-auto h-[calc(100vh-100px)]">
            <TabsContent value={ENotificationType.Verify} className="px-0 py-4">
              <TabContent
                type={ENotificationType.Verify}
                key={ENotificationType.Verify}
                emptyText="Thông báo về xác thực tài khoản của bạn có hợp lệ không."
              />
            </TabsContent>
            <TabsContent value={ENotificationType.Review} className="px-0 py-4">
              <TabContent
                type={ENotificationType.Review}
                key={ENotificationType.Review}
                emptyText="Chúng tôi sẽ thông báo cho bạn về video bạn đăng có vi phạm chính sách hay không."
              />
            </TabsContent>
            <TabsContent
              value={ENotificationType.Mention_like}
              className="px-0 py-4"
            >
              <TabContent
                type={ENotificationType.Mention_like}
                key={ENotificationType.Mention_like}
                emptyText="Từ lượt thích đến lượt đăng lại và nhiều hơn thế nữa, đây chính là nơi diễn ra mọi hoạt động."
              />
            </TabsContent>
            <TabsContent value={ENotificationType.Follow} className="px-0 py-4">
              <TabContent
                type={ENotificationType.Follow}
                key={ENotificationType.Follow}
                emptyText="Những ai đang theo dõi bạn, đây chính là nơi diễn ra mọi hoạt động."
              />
            </TabsContent>

            <TabsContent value={ENotificationType.Other} className="px-0 py-4">
              <TabContent
                type={ENotificationType.Other}
                key={ENotificationType.Other}
                emptyText="Đây chính là nơi diễn ra mọi hoạt động."
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
