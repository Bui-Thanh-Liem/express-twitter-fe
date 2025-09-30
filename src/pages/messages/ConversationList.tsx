import { Pin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "~/components/icons/close";
import { DotIcon } from "~/components/icons/dot";
import { AvatarMain, GroupAvatarMain } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WrapIcon } from "~/components/wrapIcon";
import {
  useDeleteConversation,
  useGetMultiConversations,
  useReadConversation,
} from "~/hooks/useFetchConversations";
import { cn } from "~/lib/utils";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { IMessage } from "~/shared/interfaces/schemas/message.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { useUserStore } from "~/store/useUserStore";
import { formatTimeAgo } from "~/utils/formatTimeAgo";
import { handleResponse } from "~/utils/handleResponse";

function ConversationItemSkeleton() {
  return (
    <div className="p-3 flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

function ConversationItem({
  onclick,
  isActive,
  currentUser,
  conversation,
}: {
  isActive: boolean;
  onclick: () => void;
  currentUser: IUser | null;
  conversation: IConversation;
}) {
  //
  const apiDelConversation = useDeleteConversation();

  //
  const { avatar, lastMessage, name, _id } = conversation;

  //
  let messageLastContent = "Chưa có tin nhắn";
  if (lastMessage) {
    const _lastMessage = lastMessage as IMessage;
    const isOwner = currentUser?._id === _lastMessage.sender;
    messageLastContent = `${isOwner ? "Bạn: " : ""}${_lastMessage.content}`;
  }

  const isUnread = conversation.readStatus?.includes(currentUser?._id || "");

  //
  function onPin(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  //
  async function onDelete(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const res = await apiDelConversation.mutateAsync({ conversation_id: _id });
    handleResponse(res);
  }

  //
  return (
    <div
      className={cn(
        "relative p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer group",
        isActive && "bg-blue-50"
      )}
      onClick={onclick}
    >
      <div className="relative flex items-center gap-3">
        <span className="absolute bottom-0 left-8 z-10 w-3 h-3 bg-green-400 rounded-full border border-white" />
        {typeof avatar === "string" ? (
          <AvatarMain src={avatar} alt={name || ""} className="w-12 h-12" />
        ) : (
          <GroupAvatarMain srcs={avatar as string[]} />
        )}
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500 truncate max-w-[160px]">
            {messageLastContent}
          </p>
        </div>
      </div>

      {/* Right side: time + dropdown trigger (keeps trigger in DOM so Radix can measure) */}
      <div className="relative">
        <div className="relative w-16 h-6 flex items-center justify-end">
          {/* time: fade out on hover */}
          <span className="text-gray-400 text-sm transition-opacity duration-150 opacity-100 group-hover:opacity-0">
            {lastMessage?.created_at &&
              formatTimeAgo(lastMessage.created_at as unknown as string)}
          </span>

          {/* dropdown trigger: keep in DOM, hide visually until hover */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 flex items-center justify-end rounded-full outline-0
                     opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
                     transition-opacity duration-150"
              >
                <WrapIcon>
                  <DotIcon size={16} />
                </WrapIcon>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              side="right"
              sideOffset={6}
              className="rounded-2xl px-0"
            >
              <DropdownMenuItem
                className="cursor-pointer px-3 font-semibold"
                onClick={onPin}
              >
                <Pin strokeWidth={2} className="w-6 h-6" color="#000" />
                <p className="ml-2">{true ? "Ghim" : "Gỡ"}</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer h-10 px-3 font-semibold"
                onClick={onDelete}
              >
                <CloseIcon size={24} color="#000" />
                <p className="ml-2">Xoá</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isUnread && (
        <span className="absolute top-2 left-2 w-2 h-2 bg-sky-400 rounded-full" />
      )}
    </div>
  );
}

export function ConversationList({
  onclick,
}: {
  onclick: (conversation: IConversation) => void;
}) {
  const { user } = useUserStore();

  const [page, setPage] = useState(1);
  const [idActive, setIdActive] = useState("");
  const [allConversations, setAllConversations] = useState<IConversation[]>([]);
  const total_page_ref = useRef(0);

  const { data, isLoading, error } = useGetMultiConversations({
    page: page.toString(),
    limit: "10",
  });

  const apiReadConversation = useReadConversation();

  const { joinConversation, leaveConversation } = useConversationSocket(
    (_new) => {
      // cập nhật khi có new conversation
      setAllConversations((prev) =>
        prev.map((c) =>
          c._id.toString() === _new._id.toString() ? { ...c, ..._new } : c
        )
      );
    },
    () => {},
    (changed) => {
      console.log("changed:::", changed);
      setAllConversations((prev) =>
        prev.map((c) =>
          c._id.toString() === changed._id.toString() ? { ...c, ...changed } : c
        )
      );
    }
  );

  // Join/leave socket rooms
  useEffect(() => {
    const conversationIds = allConversations?.map((item) => item._id);
    if (conversationIds.length > 0) {
      joinConversation(conversationIds);
    }
    return () => {
      if (conversationIds.length > 0) {
        leaveConversation(conversationIds);
      }
    };
  }, [allConversations, joinConversation, leaveConversation]);

  // Mỗi lần fetch API xong thì merge vào state (loại bỏ duplicate)
  useEffect(() => {
    const items = data?.data?.items || [];
    const total_page = data?.data?.total_page;
    total_page_ref.current = total_page || 0;

    if (items && items.length > 0) {
      setAllConversations((prev) => {
        const existIds = new Set(prev.map((c) => c._id.toString()));
        const newItems = items.filter(
          (item) => !existIds.has(item._id.toString())
        );
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  useEffect(() => {
    return () => {
      setPage(1);
      setAllConversations([]);
    };
  }, []);

  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  async function handleClickConversation(conversation: IConversation) {
    onclick(conversation);
    setIdActive(conversation?._id);
    await apiReadConversation.mutateAsync({
      conversation_id: conversation?._id,
    });
  }

  if (!isLoading && allConversations.length === 0 && page === 1) {
    return (
      <p className="p-4 text-center text-gray-500">Không có cuộc trò chuyện</p>
    );
  }

  return (
    <div>
      {/* Loading lần đầu */}
      {isLoading && page === 1 && (
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <ConversationItemSkeleton key={i} />
          ))}
        </div>
      )}

      {/* List conversations */}
      {allConversations.length > 0 && (
        <div>
          {allConversations.map((conversation) => (
            <ConversationItem
              currentUser={user}
              key={conversation._id.toString()}
              conversation={conversation}
              isActive={idActive === conversation._id}
              onclick={() => handleClickConversation(conversation)}
            />
          ))}
        </div>
      )}

      {/* Loading khi load thêm */}
      {isLoading ? (
        <div className="p-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <ConversationItemSkeleton key={`more-${i}`} />
          ))}
        </div>
      ) : (
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

      {/* Error state */}
      {error && (
        <p className="text-center text-red-500 p-6">
          Có lỗi khi tải dữ liệu. Vui lòng thử lại!
        </p>
      )}
    </div>
  );
}
