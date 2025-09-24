import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { EmojiSelector } from "~/components/emoji-picker";
import { AvatarMain, GroupAvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { WrapIcon } from "~/components/wrapIcon";
import { useEmojiInsertion } from "~/hooks/useEmojiInsertion";
import { useGetMultiMessages } from "~/hooks/useFetchMessages";
import { useTextareaAutoResize } from "~/hooks/useTextareaAutoResize";
import type { IMessage } from "~/shared/interfaces/schemas/message.interface";
import { useChatSocket } from "~/socket/hooks/useChatSocket";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUserStore } from "~/store/useUserStore";
import { CreateConversation } from "./CreateConversation";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

export default function ChatBox() {
  //
  const { leaveConversation, joinConversation } = useConversationSocket(
    (newConversation) => {
      console.log("Nhận từ server (socket) newConversation:::", newConversation);
    },
    (unreadCount) => {
      console.log("Nhận từ server (socket) unreadCount:::", unreadCount);
    }
  );
  const { pathname } = useLocation();
  const { close, conversation } = useChatBoxStore();
  const { user } = useUserStore();

  //
  useEffect(() => {
    if (conversation?._id) {
      console.log("joinConversation:::", conversation?._id);
      joinConversation([conversation?._id]);
    }

    return () => {
      if (conversation?._id) {
        console.log("leaveConversation:::", conversation?._id);
        leaveConversation([conversation?._id]);
      }
    };
  }, [conversation?._id]);

  //
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { sendMessage } = useChatSocket((newDataMessage) => {
    console.log("new message socket");
    setMessages((prev) => {
      return [...prev, newDataMessage];
    });
  });

  //
  const { data } = useGetMultiMessages(conversation?._id, {
    page: "1",
    limit: "100",
  });

  //
  useEffect(() => {
    const _messages = data?.data?.items || [];
    console.log("co set lai messages khong ");
    setMessages(_messages);
  }, [data?.data?.items]);

  //
  const { register, reset, handleSubmit, setValue, watch } = useForm<{
    text: string;
  }>({
    defaultValues: { text: "" },
  });

  //
  const { textareaRef, autoResize } = useTextareaAutoResize();
  const { insertEmoji } = useEmojiInsertion(textareaRef);

  // Watch content for real-time updates
  const contentValue = watch("text");

  //
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Memoized handlers
  const handleEmojiClick = useCallback(
    (emoji: string) => {
      const newContent = insertEmoji(emoji, contentValue);
      setValue("text", newContent);
    },
    [contentValue, insertEmoji, setValue]
  );

  //
  const handleTextareaInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const newValue = autoResize(e.currentTarget, 1);
      if (newValue !== contentValue) {
        setValue("text", newValue);
      }
    },
    [autoResize, setValue, contentValue]
  );

  //
  const onSubmit = useCallback(
    (data: { text: string }) => {
      sendMessage({
        content: data.text,
        sender: user?._id,
        conversation: conversation?._id,
      });

      reset();
    },
    [conversation?._id, reset, sendMessage, user?._id]
  );

  //
  function closeChatBox() {
    close();
  }

  if (!conversation || pathname === "/messages") return null;

  return (
    <div className="fixed bottom-8 right-8 bg-white z-50">
      <Card className="w-[400px] h-[580px] gap-2 rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex gap-x-4 items-center">
            {typeof conversation.avatar === "string" ? (
              <AvatarMain
                src={conversation.avatar}
                alt={conversation.name || ""}
              />
            ) : (
              <GroupAvatarMain srcs={conversation.avatar as string[]} />
            )}
            <div>
              <CardTitle>{conversation?.name}</CardTitle>
              <CardDescription className="text-xs">
                2 phút trước
              </CardDescription>
            </div>
          </div>
          <CardAction className="flex items-center gap-2">
            <CreateConversation
              initialUserIds={(conversation.participants as IUser[]).map(
                (user) => user._id
              )}
            />
            <WrapIcon onClick={closeChatBox}>
              <X className="h-[18px] w-[18px]" />
            </WrapIcon>
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col border-t pt-4">
          <ScrollArea className="pr-4 h-full max-h-[380px]">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex items-start gap-2 ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== user?._id && (
                    <AvatarMain
                      className="w-8 h-8"
                      src={conversation.avatar as string}
                      alt={conversation.name as string}
                    />
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm ${
                      msg.sender === user?._id
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              <div ref={endOfMessagesRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative flex gap-2 pt-4 border-t">
              <p className="absolute top-1 -left-2.5 w-5 h-5 flex items-center justify-center rounded-full bg-blue-400 text-[10px] text-white">
                {60 - (isNaN(contentValue?.length) ? 0 : contentValue?.length)}
              </p>
              <textarea
                {...register("text")}
                ref={textareaRef}
                autoComplete="off"
                value={contentValue}
                autoCorrect="off"
                spellCheck="false"
                className="outline-0 w-full text-md placeholder:text-gray-500 bg-blue-50 rounded-xl resize-none p-2"
                placeholder="Nhập văn bản"
                onInput={handleTextareaInput}
                rows={2}
                maxLength={60}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // chặn xuống dòng mặc định
                    handleSubmit(onSubmit)(); // gọi submit form
                  }
                }}
              />
              <span>
                <WrapIcon className="hover:bg-blue-100/60">
                  <EmojiSelector onEmojiClick={handleEmojiClick} />
                </WrapIcon>
              </span>
              <ButtonMain type="submit">Gửi</ButtonMain>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
