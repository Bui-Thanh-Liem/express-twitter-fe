import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EmojiSelector } from "~/components/emoji-picker";
import { DotIcon } from "~/components/icons/dot";
import { AvatarMain, GroupAvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { WrapIcon } from "~/components/wrapIcon";
import { useEmojiInsertion } from "~/hooks/useEmojiInsertion";
import { useGetMultiMessages } from "~/hooks/useFetchMessages";
import { useTextareaAutoResize } from "~/hooks/useTextareaAutoResize";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { IMessage } from "~/shared/interfaces/schemas/message.interface";
import { useChatSocket } from "~/socket/hooks/useChatSocket";
import { useUserStore } from "~/store/useUserStore";
import { CreateConversation } from "./CreateConversation";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { CircularProgress } from "~/components/ui/circular-progress";

const MAX_LENGTH_TEXT = 160;
export function MessageView({
  conversation,
}: {
  conversation: IConversation | null;
}) {
  //
  const { user } = useUserStore();
  const { sendMessage } = useChatSocket((newDataMessage) => {
    console.log("new message socket");
    setMessages((prev) => {
      return [...prev, newDataMessage];
    });
  });

  const [messages, setMessages] = useState<IMessage[]>([]);

  //
  const { data } = useGetMultiMessages(conversation?._id, {
    page: "1",
    limit: "50",
  });

  useEffect(() => {
    const _messages = data?.data?.items || [];
    console.log("co set lai messages khong ");
    setMessages(_messages);
  }, [data?.data?.items]);

  //
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  if (!conversation)
    return (
      <div className="h-[calc(100vh-120px)] col-span-8 flex gap-5 flex-col items-center justify-center">
        <p className="text-2xl font-bold">Chào mừng đến với x.com</p>
        <p className="w-2/3 text-gray-400">
          Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân,
          bạn bè được tối ưu hoá cho máy tính của bạn.
        </p>
        <img className="w-1/2" src="./message-view.png" alt="" />
        <p>Nhắn tin nhiều hơn, soạn thảo ít hơn</p>
      </div>
    );

  return (
    <div className="col-span-8 h-full flex flex-col">
      <div className="p-3 flex items-center justify-between bg-blue-50">
        <div className="flex items-center gap-3">
          {typeof conversation.avatar === "string" ? (
            <AvatarMain
              src={conversation.avatar}
              alt={conversation.name || ""}
            />
          ) : (
            <GroupAvatarMain srcs={conversation.avatar as string[]} />
          )}
          <div>
            <p>{conversation?.name}</p>
            <p className="text-sm text-gray-400">online</p>
          </div>
        </div>

        <div>
          <CreateConversation
            initialUserIds={(conversation.participants as IUser[]).map(
              (user) => user._id
            )}
          />

          <WrapIcon
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="ml-4"
          >
            <DotIcon size={18} />
          </WrapIcon>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3">
        <ScrollArea className="pr-4 h-[calc(100vh-250px)]">
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
                      ? "bg-blue-400 text-white ml-auto"
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
            <div className="absolute top-1 -left-2.5 ">
              <CircularProgress
                value={isNaN(contentValue?.length) ? 0 : contentValue?.length}
                max={MAX_LENGTH_TEXT}
                size={20}
              />
            </div>
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
              rows={3}
              maxLength={MAX_LENGTH_TEXT}
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
      </div>
    </div>
  );
}
