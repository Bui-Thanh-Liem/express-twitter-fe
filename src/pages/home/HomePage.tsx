import { ButtonMain } from "@/components/button-main";
import { TypographyP } from "@/components/elements/p";
import { EarthIcon } from "@/components/icons/earth";
import { ImageIcon } from "@/components/icons/image";
import { WrapIon } from "@/components/wrapIcon";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { FollowingContent } from "./FollowingContent";
import { ForYouContent } from "./ForYouContent";
import { EmojiSelector } from "@/components/emoji-picker";

const FormSchema = z.object({
  content: z.string().trim(),
});
type FormValues = z.infer<typeof FormSchema>;

export function HomePage() {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  });

  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you"
  );

  const classNav =
    "flex-1 h-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 font-semibold transition-colors relative";
  const classActive =
    "text-black font-bold after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-26 after:h-1 after:rounded-full after:bg-[#1D9BF0]";

  //
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Xử lý submit form ở đây
  };

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
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                {...register("content")}
                className="border-0 outline-0 w-full text-lg placeholder:text-gray-500 bg-transparent resize-none"
                placeholder="Có chuyện gì thế ?"
                onInput={(e) => {
                  const el = e.currentTarget;

                  // Cắt bớt nếu quá 12 dòng
                  const lines = el.value.split("\n");
                  if (lines.length > 12) {
                    el.value = lines.slice(0, 12).join("\n");
                  }

                  // Auto resize chiều cao
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }}
              />
              <span className="px-3 -ml-3 text-[#1D9BF0] hover:bg-[#E8F5FD] rounded-full inline-flex gap-2 items-center cursor-pointer">
                <EarthIcon />
                <TypographyP className="font-semibold">
                  Mọi người đều có thể trả lời
                </TypographyP>
              </span>
              <div className="w-full border-b border-gray-200 mt-3" />

              {/* Optional: Submit button */}
              <div className="flex justify-between my-2">
                <div>
                  <WrapIon>
                    <ImageIcon />
                  </WrapIon>
                  <WrapIon>
                    <EmojiSelector onEmojiClick={() => {}} />
                  </WrapIon>
                </div>
                <ButtonMain>Đăng Bài</ButtonMain>
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
