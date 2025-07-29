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
      <span onClick={() => setOpen(!open)} className="cursor-pointer">
        <EmojiIcon />
      </span>
      <EmojiPicker
        className="fixed left-0 -bottom-6"
        open={open}
        onEmojiClick={(emojiData) => onEmojiClick(emojiData.emoji)}
      />
    </div>
  );
}
