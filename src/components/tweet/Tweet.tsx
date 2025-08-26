import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { EmojiSelector } from "~/components/emoji-picker";
import { CloseIcon } from "~/components/icons/close";
import { ImageIcon } from "~/components/icons/image";
import { TweetAudience } from "~/components/tweet/tweet-audience";
import { WrapIcon } from "~/components/wrapIcon";
import { useEmojiInsertion } from "~/hooks/useEmojiInsertion";
import { useCreateTweet } from "~/hooks/useFetchTweet";
import { useUploadWithValidation } from "~/hooks/useFetchUpload";
import { useMediaPreview } from "~/hooks/useMediaPreview";
import { useTextareaAutoResize } from "~/hooks/useTextareaAutoResize";
import { cn } from "~/lib/utils";
import {
  CreateTweetDtoSchema,
  type CreateTweetDto,
} from "~/shared/dtos/req/tweet.dto";
import { ETweetAudience } from "~/shared/enums/common.enum";
import { EMediaType, ETweetType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { useUserStore } from "~/store/useUserStore";
import { handleResponse } from "~/utils/handleResponse";
import { toastSimple } from "~/utils/toastSimple.util";
import { TweetItem } from "../list-tweets/item-tweet";
import { AvatarMain } from "../ui/avatar";
import { ButtonMain } from "../ui/button";

// Constants
const DEFAULT_VALUES: CreateTweetDto = {
  content: "",
  audience: ETweetAudience.Everyone,
  type: ETweetType.Tweet,
};

const MAX_LINES = 12;

export function Tweet({
  tweet,
  onSuccess,
  tweetType = ETweetType.Tweet,
  contentBtn = "Đăng Bài",
  placeholder = "Có chuyện gì thế ?",
}: {
  tweet?: ITweet;
  placeholder?: string;
  contentBtn?: string;
  onSuccess?: () => void;
  tweetType?: ETweetType;
}) {
  const { user } = useUserStore();
  const apiCreateTweet = useCreateTweet();
  const apiUploadMedia = useUploadWithValidation();

  const { textareaRef, autoResize } = useTextareaAutoResize();
  const [audience, setAudience] = useState<ETweetAudience>(
    ETweetAudience.Everyone
  );
  const { insertEmoji } = useEmojiInsertion(textareaRef);
  const {
    selectedFile,
    previewUrl,
    uploadedMediaUrl,
    mediaType,
    uploadProgress,
    setUploadedMediaUrl,
    setUploadProgress,
    handleFileChange,
    removeMedia,
    formatFileSize,
  } = useMediaPreview();

  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<CreateTweetDto>({
    resolver: zodResolver(CreateTweetDtoSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange", // Enable real-time validation
  });
  logger.info("Tweet - form - isValid:::", isValid);

  // Watch content for real-time updates
  const contentValue = watch("content");

  // Memoized handlers
  const handleEmojiClick = useCallback(
    (emoji: string) => {
      const newContent = insertEmoji(emoji, contentValue);
      setValue("content", newContent);
    },
    [insertEmoji, contentValue, setValue]
  );

  //
  const handleTextareaInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const newValue = autoResize(e.currentTarget, MAX_LINES);
      if (newValue !== contentValue) {
        setValue("content", newValue);
      }
    },
    [autoResize, setValue, contentValue]
  );

  //
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(e);
    },
    [handleFileChange]
  );

  const successForm = useCallback(() => {
    reset(DEFAULT_VALUES);
    removeMedia(); // Clear media after successful submission
    setUploadedMediaUrl("");
    setUploadProgress(0);
    if (onSuccess) onSuccess(); // Sử dụng cho bên ngoài component cha (VD: đống modal)
  }, [removeMedia, reset, setUploadProgress, setUploadedMediaUrl, onSuccess]);

  const onSubmit = useCallback(
    async (data: CreateTweetDto) => {
      try {
        setIsUploading(true);
        let mediaUrl = uploadedMediaUrl;

        // Upload media first if file is selected and not already uploaded
        if (selectedFile && !uploadedMediaUrl) {
          logger.info(`Uploading ${mediaType}...`);

          // Simulate progress for better UX (if your API doesn't support progress)
          setUploadProgress(10);

          try {
            const resUploadMedia = await apiUploadMedia.mutateAsync([
              selectedFile,
            ]);
            setUploadProgress(90);
            if (resUploadMedia.statusCode !== 200 || !resUploadMedia.data) {
              handleResponse(resUploadMedia);
              return;
            }
            mediaUrl = resUploadMedia.data[0];
            setUploadedMediaUrl(mediaUrl);
            setUploadProgress(100);
          } catch (uploadError) {
            setUploadProgress(0);
            console.error("Error submitting uploadMedia:", uploadError);
            toastSimple((uploadError as { message: string }).message);
          }
        }

        //
        const tweetData: CreateTweetDto = {
          ...data,
          audience: audience,
          ...(tweet?._id && { parent_id: tweet?._id }), // Nếu có giá trị thì không phải tweet chính
          type: tweetType,
          media: mediaUrl ? { url: mediaUrl, type: mediaType! } : undefined,
        };

        logger.info("Creating tweet with data:", tweetData);
        const resCreateTweet = await apiCreateTweet.mutateAsync(tweetData);

        handleResponse(resCreateTweet, successForm);
      } catch (error) {
        console.error("Error submitting tweet:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng bài";
        toastSimple(errorMessage);
        setUploadProgress(0);
      } finally {
        setIsUploading(false);
      }
    },
    [
      uploadedMediaUrl,
      selectedFile,
      audience,
      tweet?._id,
      tweetType,
      mediaType,
      apiCreateTweet,
      successForm,
      setUploadProgress,
      apiUploadMedia,
      setUploadedMediaUrl,
    ]
  );

  // Computed values
  const isContentEmpty = !contentValue?.trim();
  const isFormDisabled = isContentEmpty || isSubmitting || isUploading;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <AvatarMain src={user?.avatar} alt={user?.name} />
          <div className="flex-1 mt-2">
            <textarea
              {...register("content")}
              ref={textareaRef}
              autoComplete="off"
              value={contentValue}
              autoCorrect="off"
              spellCheck="false"
              className="border-0 outline-0 w-full text-lg placeholder:text-gray-500 bg-transparent resize-none"
              placeholder={placeholder}
              onInput={handleTextareaInput}
              rows={1}
            />

            {/* Media preview */}
            {previewUrl && (
              <div
                key={tweetType}
                className="relative mt-3 rounded-xl overflow-hidden border border-gray-200 inline-block max-w-full"
              >
                {mediaType === EMediaType.Image ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-80 object-cover"
                  />
                ) : mediaType === EMediaType.Video ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-w-full max-h-80"
                    preload="metadata"
                  >
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                ) : null}

                <WrapIcon
                  onClick={removeMedia}
                  className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-400 transition-opacity z-10"
                >
                  <CloseIcon />
                </WrapIcon>

                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <div className="text-white text-sm bg-black bg-opacity-70 px-3 py-2 rounded-2xl flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang đăng{" "}
                        {mediaType === EMediaType.Video ? "video" : "ảnh"}...
                      </div>
                      {mediaType === EMediaType.Video && uploadProgress > 0 && (
                        <div className="w-32">
                          <div className="bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-center">
                            {uploadProgress}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {uploadedMediaUrl && !isUploading && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    ✓ Đã upload{" "}
                    {mediaType === EMediaType.Video ? "video" : "ảnh"}
                  </div>
                )}
              </div>
            )}

            {/* File info */}
            {(mediaType === EMediaType.Video ||
              mediaType === EMediaType.Image) && (
              <div className="bg-[#EAFAFF] bg-opacity-60 text-black font-semibold text-xs p-2 rounded">
                {mediaType === EMediaType.Video ? "🎬" : "🖼️"}{" "}
                {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
              </div>
            )}

            {/*  */}
            {(tweetType === ETweetType.Tweet ||
              tweetType === ETweetType.QuoteTweet) && (
              <TweetAudience onChangeAudience={setAudience} />
            )}

            {/*  */}
            {tweetType === ETweetType.QuoteTweet && tweet && (
              <div className="w-ful mt-1 rounded-3xl border overflow-hidden">
                <TweetItem isAction={false} tweet={tweet} />
              </div>
            )}
            <div className="w-full border-b border-gray-200 mt-3" />

            <div
              className={cn(
                "flex justify-between items-center -ml-2 my-2 bg-white",
                tweetType === ETweetType.QuoteTweet ? "" : ""
              )}
            >
              <div className="flex items-center gap-1">
                <WrapIcon className="hover:bg-blue-100/60">
                  <label
                    htmlFor={`image-upload-${tweetType}`}
                    className="cursor-pointer"
                    title="Thêm ảnh hoặc video"
                  >
                    <ImageIcon />
                    <input
                      id={`image-upload-${tweetType}`}
                      className="hidden"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/mov,video/avi,video/quicktime"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                  </label>
                </WrapIcon>

                <WrapIcon className="hover:bg-blue-100/60">
                  <EmojiSelector onEmojiClick={handleEmojiClick} />
                </WrapIcon>
              </div>

              <div className="flex items-center gap-3">
                {/* Character count indicator */}
                <span
                  className={`text-sm ${
                    contentValue?.length > 280
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {contentValue?.length}/280
                </span>

                <ButtonMain type="submit" disabled={isFormDisabled}>
                  {isUploading
                    ? `${contentBtn} ${
                        mediaType === EMediaType.Video ? "video" : "ảnh"
                      }...`
                    : isSubmitting
                    ? "Đang đăng..."
                    : contentBtn}
                </ButtonMain>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
