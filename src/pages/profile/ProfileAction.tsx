import { X } from "lucide-react";
import { useState } from "react";
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
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { WrapIcon } from "~/components/wrapIcon";
import { useFollowUser } from "~/hooks/useFetchFollow";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

type Message = {
  id: number;
  sender: "me" | "other";
  text: string;
};

export function ProfileEdit({ currentUser }: { currentUser: IUser }) {
  const [isOpen, setIsOpen] = useState(false);

  console.log("ProfileEdit");

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

export default function ChatBox({
  profile,
  onClose,
}: {
  profile: IUser;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "other", text: "Xin chào 👋" },
    { id: 2, sender: "me", text: "Chào bạn, mình có thể giúp gì?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "me", text: input },
    ]);
    setInput("");
  };

  console.log("ChatBox");

  return (
    <div className="fixed bottom-8 right-8 bg-white">
      <Card className="w-[400px] h-[600px] flex flex-col rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex gap-x-4 items-center">
            <AvatarMain src={profile.avatar} alt={profile.name} />
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription className="text-xs">
                2 phút trước
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <WrapIcon onClick={onClose}>
              <X className="h-4 w-4" />
            </WrapIcon>
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col border-t pt-3">
          <ScrollArea className="flex-1 pr-4">
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
                      src={profile.avatar}
                      alt={profile.name}
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
            </div>
          </ScrollArea>

          <div className="flex gap-2 pt-2 border-t">
            <Input
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <ButtonMain onClick={sendMessage}>Gửi</ButtonMain>
          </div>
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
  const [openChatBox, setOpenChatBox] = useState(false);

  console.log("ProfileAction");

  return (
    <>
      {isOwnProfile ? (
        <ProfileEdit currentUser={profile as IUser} />
      ) : (
        <div className="flex items-center gap-x-3 mt-20">
          <WrapIcon className="border" onClick={() => setOpenChatBox(true)}>
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

      {openChatBox && (
        <ChatBox profile={profile} onClose={() => setOpenChatBox(false)} />
      )}
    </>
  );
}
