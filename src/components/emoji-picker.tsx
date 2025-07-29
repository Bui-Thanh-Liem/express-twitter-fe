import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { EmojiIcon } from "./icons/emoji";

export function EmojiSelector({
  onEmojiClick,
}: {
  onEmojiClick: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <span onClick={() => setOpen(!open)}>
        <EmojiIcon />
      </span>

      {open && (
        <>
          {/* Overlay để bắt sự kiện click ra ngoài */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          {/* Emoji picker popup */}
          <div className="absolute right-1/2 translate-x-1/2 top-full mt-2 z-40">
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-3 bg-white rotate-45 shadow-sm" />
            </div>
            <EmojiPicker
              onEmojiClick={(emojiData) => onEmojiClick(emojiData.emoji)}
            />
          </div>
        </>
      )}
    </div>
  );
}
