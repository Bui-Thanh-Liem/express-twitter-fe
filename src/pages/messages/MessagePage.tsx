import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { WrapIcon } from "~/components/wrapIcon";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import { ConversationList } from "./ConversationList";
import { MessageView } from "./MessageView";

export function MessagePage() {
  const navigate = useNavigate();

  const [conversationActive, setConversationActive] =
    useState<IConversation | null>(null);

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex items-center border border-gray-100">
        <div className="flex h-12 items-center gap-6 ">
          <WrapIcon onClick={() => navigate(-1)}>
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Tin nhắn</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12">
        {/* Conversations */}
        <div className="col-span-4 h-full border-r">
          <div>
            <ConversationList
              onclick={(conversation) => setConversationActive(conversation)}
            />
          </div>
        </div>

        {/* Message view */}
        <MessageView conversation={conversationActive} />
      </div>
    </div>
  );
}
