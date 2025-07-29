import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonMain } from "~/components/button-main";
import { TypographyP } from "~/components/elements/p";
import { EmojiSelector } from "~/components/emoji-picker";
import { EarthIcon } from "~/components/icons/earth";
import { ImageIcon } from "~/components/icons/image";
import { WrapIon } from "~/components/wrapIcon";
import { useCreateTweet } from "~/hooks/useFetchTweet";
import { cn } from "~/lib/utils";
import {
  CreateTweetDtoSchema,
  type CreateTweetDto,
} from "~/shared/dtos/req/tweet.dto";
import { ETweetAudience } from "~/shared/enums/common.enum";
import { ETweetType } from "~/shared/enums/type.enum";
import { handleResponse } from "~/utils/handleResponse";
import { FollowingContent } from "./FollowingContent";
import { ForYouContent } from "./ForYouContent";

export function HomePage() {
  const apiCreateTweet = useCreateTweet();
  const { reset, handleSubmit, setValue } = useForm<CreateTweetDto>({
    resolver: zodResolver(CreateTweetDtoSchema),
    defaultValues: {
      content: "",
      audience: ETweetAudience.Everyone,
      type: ETweetType.Tweet,
    },
  });

  // Ref để truy cập textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you"
  );

  // State local để quản lý content
  const [contentValue, setContentValue] = useState("");

  const classNav =
    "flex-1 h-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 font-semibold transition-colors relative";
  const classActive =
    "text-black font-bold after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-26 after:h-1 after:rounded-full after:bg-[#1D9BF0]";

  // Hàm xử lý khi chọn emoji
  const handleEmojiClick = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBefore = contentValue.substring(0, cursorPosition);
    const textAfter = contentValue.substring(cursorPosition);

    const newContent = textBefore + emoji + textAfter;

    // Cập nhật state local và form
    setContentValue(newContent);
    setValue("content", newContent);

    // Focus lại textarea và đặt cursor sau emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        cursorPosition + emoji.length,
        cursorPosition + emoji.length
      );
      // Auto resize
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, 0);
  };

  // Hàm xử lý khi content thay đổi
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContentValue(value);
    setValue("content", value);
  };

  // Hàm xử lý auto resize
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    let value = el.value;

    // Cắt bớt nếu quá 12 dòng
    const lines = value.split("\n");
    if (lines.length > 12) {
      value = lines.slice(0, 12).join("\n");
      el.value = value;
      setContentValue(value);
      setValue("content", value);
    }

    // Auto resize chiều cao
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  //
  const onSubmit = async (data: CreateTweetDto) => {
    console.log("Form submitted:", data);

    const _data = {
      ...data,
      type: ETweetType.Tweet,
      audience: ETweetAudience.Everyone,
    } as CreateTweetDto;
    const res = await apiCreateTweet.mutateAsync(_data);
    handleResponse(res, successForm);
  };

  //
  function successForm() {
    reset();
  }

  return (
    <main className="relative h-screen flex flex-col">
      {/* Fixed Navigation Bar */}
      <div className="h-14 bg-white/50 backdrop-blur-md z-50 flex border-b border-gray-200 flex-shrink-0">
        <div className="flex w-full h-full">
          <TypographyP
            className={cn(classNav, activeTab === "for-you" && classActive)}
            onClick={() => setActiveTab("for-you")}
          >
            Dành Cho Bạn
          </TypographyP>
          <TypographyP
            className={cn(classNav, activeTab === "following" && classActive)}
            onClick={() => setActiveTab("following")}
          >
            Đã Theo Dõi
          </TypographyP>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage
                className="w-11 h-11 rounded-full"
                src="https://github.com/shadcn.png"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1 mt-2">
              <textarea
                ref={textareaRef}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                value={contentValue}
                onChange={handleContentChange}
                className="border-0 outline-0 w-full text-lg placeholder:text-gray-500 bg-transparent resize-none"
                placeholder="Có chuyện gì thế ?"
                onInput={handleTextareaInput}
              />
              <span className="px-3 -ml-3 text-[#1D9BF0] hover:bg-[#E8F5FD] rounded-full inline-flex gap-2 items-center cursor-pointer">
                <EarthIcon />
                <TypographyP className="font-semibold">
                  Mọi người đều có thể trả lời
                </TypographyP>
              </span>
              <div className="w-full border-b border-gray-200 mt-3" />

              {/* Optional - Submit button */}
              <div className="flex justify-between my-2">
                <div>
                  <WrapIon>
                    <ImageIcon />
                  </WrapIon>
                  <WrapIon>
                    <EmojiSelector onEmojiClick={handleEmojiClick} />
                  </WrapIon>
                </div>
                <ButtonMain disabled={!contentValue.trim()}>
                  Đăng Bài
                </ButtonMain>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="border-b border-gray-200" />

      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {activeTab === "for-you" ? <ForYouContent /> : <FollowingContent />}
      </div>
    </main>
  );
}
