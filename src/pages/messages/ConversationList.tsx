import { useCallback, useEffect, useRef, useState } from "react";
import { DotIcon } from "~/components/icons/dot";
import { AvatarMain, GroupAvatarMain } from "~/components/ui/avatar";
import { WrapIcon } from "~/components/wrapIcon";
import { useGetMultiConversations } from "~/hooks/useFetchConversations";
import { cn } from "~/lib/utils";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { IMessage } from "~/shared/interfaces/schemas/message.interface";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUserStore } from "~/store/useUserStore";

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
  conversation,
}: {
  isActive: boolean;
  onclick: () => void;
  conversation: IConversation;
}) {
  const { user } = useUserStore();
  if (!conversation) return null;
  const { avatar, lastMessage, name } = conversation;

  //
  let messageLastContent = "Chưa có tin nhắn";
  if (lastMessage) {
    const _lastMessage = lastMessage as IMessage;
    const isOwner = user?._id === _lastMessage.sender;
    messageLastContent = `${isOwner ? "Bạn: " : ""}${_lastMessage.content}`;
  }

  return (
    <div
      className={cn(
        "p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer",
        isActive && "bg-blue-50"
      )}
      onClick={onclick}
    >
      <div className="flex items-center gap-3">
        {typeof avatar === "string" ? (
          <AvatarMain src={avatar} alt={name || ""} />
        ) : (
          <GroupAvatarMain srcs={avatar as string[]} />
        )}
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500 truncate max-w-[180px]">
            {messageLastContent}
          </p>
        </div>
      </div>

      <WrapIcon
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DotIcon size={16} />
      </WrapIcon>
    </div>
  );
}

export function ConversationList({
  onclick,
}: {
  onclick: (conversation: IConversation) => void;
}) {
  const { conversation } = useChatBoxStore();
  const { joinConversation, leaveConversation } = useConversationSocket();
  const [idActive, setIdActive] = useState("");
  const [page, setPage] = useState(1);
  const [allConversations, setAllConversations] = useState<IConversation[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error } = useGetMultiConversations({
    page: page.toString(),
    limit: "20",
  });

  // Xử lý join/leave room socket
  useEffect(() => {
    const conversationIds = allConversations?.map((item) => item._id);

    // Join room khi vào trang tin nhắn
    if (conversationIds.length > 0) {
      console.log("joinConversation::", conversationIds);
      joinConversation(conversationIds);
    }

    // Leave room khi rời khỏi trang
    return () => {
      if (conversationIds.length > 0) {
        console.log("leaveConversation::", conversationIds);
        leaveConversation(conversationIds);
      }
    };
  }, [allConversations, conversation?._id]);

  // Khi data thay đổi thì update danh sách
  useEffect(() => {
    const newConversations = data?.data?.items as IConversation[];

    if (newConversations?.length) {
      if (page === 1) {
        setAllConversations(newConversations);
      } else {
        setAllConversations((prev) => {
          const existingIds = new Set(prev.map((c) => c._id));
          const filtered = newConversations.filter(
            (c) => !existingIds.has(c._id)
          );
          return [...prev, ...filtered];
        });
      }

      if (newConversations.length < 20) {
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, page]);

  function handleClickConversation(conversation: IConversation) {
    onclick(conversation);
    setIdActive(conversation?._id);
  }

  // Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading, isLoadingMore]
  );

  // Setup observer
  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    if (observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }

    observerInstanceRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    observerInstanceRef.current.observe(element);

    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Reset khi mở profile khác (nếu cần)
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
    // setAllConversations([]); // nếu muốn clear
  }, []);

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
              conversation={conversation}
              key={conversation._id}
              onclick={() => handleClickConversation(conversation)}
              isActive={idActive === conversation._id}
            />
          ))}
        </div>
      )}

      {/* Loading khi load thêm */}
      {isLoadingMore && (
        <div className="p-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <ConversationItemSkeleton key={`more-${i}`} />
          ))}
        </div>
      )}

      {/* Trigger infinite scroll */}
      <div ref={observerRef} className="h-10 w-full" />

      {/* End indicator */}
      {!hasMore && allConversations.length > 0 && (
        <div className="text-center p-6 pt-0 text-gray-500">
          🎉 Bạn đã xem hết tất cả cuộc trò chuyện!
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
