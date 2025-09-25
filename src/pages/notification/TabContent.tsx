import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "~/components/icons/close";
import { AvatarMain } from "~/components/ui/avatar";
import { WrapIcon } from "~/components/wrapIcon";
import { useGetMultiByType } from "~/hooks/useFetchNotifications";
import { cn } from "~/lib/utils";
import { ENotificationType } from "~/shared/enums/type.enum";
import type { INotification } from "~/shared/interfaces/schemas/notification.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useNotificationSocket } from "~/socket/hooks/useNotificationSocket";
import { formatTimeAgo } from "~/utils/formatTimeAgo";

//
type Props = {
  noti: INotification;
  onClick?: (noti: INotification) => void;
};

// --- Skeleton ---
function SkeletonNotiItem() {
  return (
    <div className="w-full flex items-start gap-3 p-3 rounded-lg animate-pulse">
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="h-3 rounded bg-slate-200 w-1/3" />
            <div className="mt-2 h-2 rounded bg-slate-200 w-1/4" />
          </div>
          <div className="h-2 w-8 rounded bg-slate-200" />
        </div>
        <div className="mt-3 h-3 rounded bg-slate-200 w-3/4" />
        <div className="mt-2 flex items-center gap-2">
          <div className="h-5 w-16 rounded bg-slate-200" />
          <div className="h-5 w-24 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

function NotiItem({ noti, onClick }: Props) {
  const [read, setRead] = useState(noti?.isRead);
  const sender =
    typeof noti.sender === "object" ? (noti.sender as IUser) : undefined;

  //
  function handlerClick() {
    if (onClick) onClick(noti);
    setRead(true);
  }

  //
  return (
    <button
      onClick={handlerClick}
      className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 relative ${
        read ? "bg-slate-50 hover:bg-slate-100" : "bg-sky-100"
      }`}
    >
      {/*  */}
      {!read && (
        <div className="w-2 h-2 rounded-full bg-sky-400 absolute top-1.5 left-1.5 z-10" />
      )}

      {/* Avatar */}
      <div className="flex-shrink-0">
        <AvatarMain src={sender?.avatar} alt={sender?.name || "avatar"} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-sm font-medium truncate">
              {sender?.name || "Someone"}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {sender?.username}
            </div>
            <p className="text-xs text-gray-400">
              {formatTimeAgo(noti.created_at as unknown as string)}
            </p>
          </div>
        </div>

        <div className="mt-1 text-sm text-slate-700 truncate">
          {noti.content}
        </div>

        {/* Extra row: type / ref */}
        {/* <div className="mt-2 flex items-center gap-2">
          {noti.refId && (
            <span className="text-xs text-slate-400 truncate">
              Ref: {String(noti.refId)}
            </span>
          )}
        </div> */}
      </div>

      <WrapIcon className="p-[2px] absolute top-1.5 right-1.5">
        <CloseIcon size={16} color="#e2877d" />
      </WrapIcon>
    </button>
  );
}

export function TabContent({ type }: { type: ENotificationType }) {
  //
  const [notis, setNotis] = useState<INotification[]>([]);
  const [page, setPage] = useState(1);

  //
  const total_page_ref = useRef(0);
  const { data, isLoading, refetch } = useGetMultiByType({
    queries: { page: page.toString(), limit: "20" },
    type,
  });

  // Socket
  const { readNoti } = useNotificationSocket(
    (newNoti) => {
      console.log("newNoti:::", newNoti);
      if (newNoti && newNoti.type === type) {
        setNotis((prev) => [newNoti, ...prev]);
      }
    },
    () => {}
  );

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.data?.items || [];
    const total_page = data?.data?.total_page ?? 1;
    total_page_ref.current = total_page;
    if (items.length) {
      if (page === 1) {
        setNotis(items);
      } else {
        setNotis((prev) => [...prev, ...items]);
      }
    }
  }, [data, page, type]);

  //
  useEffect(() => {
    setPage(1);
    setNotis([]);
    refetch();
  }, [refetch, type]);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  function handlerReadNot(noti: INotification) {
    if (!noti.isRead) readNoti(noti._id);
  }

  //
  return (
    <div className="space-y-4">
      {isLoading &&
        page === 1 &&
        Array.from({ length: 2 }).map((_, i) => (
          <SkeletonNotiItem key={`more-${i}`} />
        ))}

      {/*  */}
      {notis.map((item) => (
        <NotiItem key={item._id} noti={item} onClick={handlerReadNot} />
      ))}

      {/*  */}
      {isLoading
        ? Array.from({ length: 2 }).map((_, i) => (
            <SkeletonNotiItem key={`more-${i}`} />
          ))
        : page < total_page_ref.current && (
            <div className="px-4 py-3">
              <p
                className={cn(
                  "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                  total_page_ref.current <= page
                    ? "text-gray-300 pointer-events-none cursor-default"
                    : ""
                )}
                onClick={onSeeMore}
              >
                Xem thêm
              </p>
            </div>
          )}

      {/*  */}
      {!notis.length && (
        <div className="flex justify-center flex-col items-center">
          <p className="text-xl mb-1">Chưa có gì ở đây</p>
          <p className="text-gray-400 w-96 text-justify">
            Từ lượt thích đến lượt đăng lại và nhiều hơn thế nữa, đây chính là
            nơi diễn ra mọi hoạt động.
          </p>
        </div>
      )}
    </div>
  );
}
