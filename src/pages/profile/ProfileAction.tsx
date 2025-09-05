import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EmojiSelector } from "~/components/emoji-picker";
import { UpdateMeForm } from "~/components/forms/UpdateMeForm";
import { MessageIcon } from "~/components/icons/messages";
import { AvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DialogMain } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { WrapIcon } from "~/components/wrapIcon";
import { useEmojiInsertion } from "~/hooks/useEmojiInsertion";
import { useCreateConversation } from "~/hooks/useFetchConversations";
import { useFollowUser } from "~/hooks/useFetchFollow";
import { useTextareaAutoResize } from "~/hooks/useTextareaAutoResize";
import { EConversationType } from "~/shared/enums/type.enum";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useChatSocket } from "~/socket/hooks/useChatSocket";
import { useChatBoxStore } from "~/store/useChatBoxStore";

type Message = {
  id: number;
  sender: "me" | "other";
  text: string;
};

// Edit profile
export function ProfileEdit({ currentUser }: { currentUser: IUser }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ButtonMain
        variant="outline"
        className="mt-20"
        onClick={() => setIsOpen(true)}
      >
        Chỉnh sửa hồ sơ
      </ButtonMain>

      {/*  */}
      <DialogMain
        open={isOpen}
        onOpenChange={setIsOpen}
        textHeader="Chỉnh sửa hồ sơ"
        textDesc=""
        isLogo={false}
      >
        <UpdateMeForm setOpenForm={setIsOpen} currentUser={currentUser} />
      </DialogMain>
    </>
  );
}

//
export default function ChatBox() {
  //
  const { close, isOpen, conversation } = useChatBoxStore();
  const { sendMessage } = useChatSocket((newDataMessage) => {
    console.log("newDataMessage::", newDataMessage);
  });

  //
  const { register, reset, handleSubmit, setValue, watch } = useForm<{
    text: string;
  }>({
    defaultValues: { text: "" },
  });

  //
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "other", text: "Xin chào 👋" },
    { id: 2, sender: "me", text: "Chào bạn, mình có thể giúp gì?" },
    { id: 3, sender: "other", text: "Xin chào 👋" },
    {
      id: 4,
      sender: "me",
      text: "Chào bạn, mình có thể giúp gì? bạn không hiểu tiếng Việt à ?",
    },
    {
      id: 5,
      sender: "me",
      text: "Chào bạn, mình có thể giúp gì? bạn không hiểu tiếng Việt à ? bạn không hiểu tiếng Việt à ?",
    },
    { id: 6, sender: "other", text: "Xin chào 👋" },
    {
      id: 7,
      sender: "me",
      text: "Chào bạn, mình có thể giúp gì? bạn không hiểu tiếng Việt à ?",
    },
    {
      id: 8,
      sender: "me",
      text: "Chào bạn, mình có thể giúp gì? bạn không hiểu tiếng Việt à ?",
    },
  ]);

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
        createdAt: new Date(),
        text: data.text,
        roomId: conversation?._id,
      });

      reset();
    },
    [conversation?._id, reset, sendMessage]
  );

  if (!conversation) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-white" hidden={!isOpen}>
      <Card className="w-[400px] h-[580px] gap-2 rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex gap-x-4 items-center">
            <AvatarMain
              src={conversation.avatar as string}
              alt={conversation.name as string}
            />
            <div>
              <CardTitle>{conversation?.name}</CardTitle>
              <CardDescription className="text-xs">
                2 phút trước
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <WrapIcon onClick={close}>
              <X className="h-4 w-4" />
            </WrapIcon>
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col border-t pt-4">
          <ScrollArea className="pr-4 h-full max-h-[380px]">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "other" && (
                    <AvatarMain
                      className="w-8 h-8"
                      src={conversation.avatar as string}
                      alt={conversation.name as string}
                    />
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm ${
                      msg.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
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

interface IProfileActiveProps {
  isOwnProfile: boolean;
  profile: IUser;
}

export function ProfileAction({ profile, isOwnProfile }: IProfileActiveProps) {
  const { mutate } = useFollowUser();
  const { open, setConversation } = useChatBoxStore();
  const apiCreateConversation = useCreateConversation();

  async function handleOpenCheckBox() {
    console.log("payload create conversation ::", {
      type: EConversationType.Private,
      participants: [profile?._id],
    });

    const res = await apiCreateConversation.mutateAsync({
      type: EConversationType.Private,
      participants: [profile?._id],
    });
    if (res.statusCode === 200 && res?.data) {
      setConversation(res?.data);
      open();
    }
  }

  return (
    <>
      {isOwnProfile ? (
        <ProfileEdit currentUser={profile as IUser} />
      ) : (
        <div className="flex items-center gap-x-3 mt-20">
          <WrapIcon className="border" onClick={handleOpenCheckBox}>
            <MessageIcon size={18} />
          </WrapIcon>
          {
            <ButtonMain
              size="sm"
              onClick={() =>
                mutate({
                  user_id: profile._id,
                  username: profile.username || "",
                })
              }
            >
              {!profile?.isFollow ? "Theo dõi" : "Bỏ theo dõi"}
            </ButtonMain>
          }
        </div>
      )}
    </>
  );
}
