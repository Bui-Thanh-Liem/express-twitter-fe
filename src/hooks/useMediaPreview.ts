import { useCallback, useEffect, useState } from "react";
import { EMediaType } from "~/shared/enums/type.enum";
import { toastSimple } from "~/utils/toastSimple.util";

// Custom hook for media preview and upload
export const useMediaPreview = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<EMediaType | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const getMediaType = (file: File): EMediaType | null => {
    if (file.type.startsWith("image/")) return EMediaType.Image;
    if (file.type.startsWith("video/")) return EMediaType.Video;
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      // Cleanup previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (file) {
        const type = getMediaType(file);

        // Validate file type
        const validImageTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        const validVideoTypes = [
          "video/mp4",
          "video/webm",
          "video/mov",
          "video/avi",
          "video/quicktime",
        ];

        if (
          !validImageTypes.includes(file.type) &&
          !validVideoTypes.includes(file.type)
        ) {
          toastSimple(
            "Chỉ hỗ trợ file ảnh (JPEG, PNG, GIF, WebP) và video (MP4, WebM, MOV, AVI)",
            "warning"
          );
          return;
        }

        // Validate file size (different limits for image and video)
        const maxImageSize = 5 * 1024 * 1024; // 5MB for images
        const maxVideoSize = 100 * 1024 * 1024; // 100MB for videos
        const maxSize = type === EMediaType.Video ? maxVideoSize : maxImageSize;

        if (file.size > maxSize) {
          const sizeLimitText = type === EMediaType.Video ? "100MB" : "5MB";
          toastSimple(
            `File ${
              type === EMediaType.Video ? "video" : "ảnh"
            } không được vượt quá ${sizeLimitText}\nFile hiện tại: ${formatFileSize(
              file.size
            )}`,
            "warning"
          );
          return;
        }

        const mediaUrl = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(mediaUrl);
        setMediaType(type);
        setUploadedMediaUrl(""); // Reset uploaded URL when new file selected
        setUploadProgress(0);
      } else {
        setSelectedFile(null);
        setPreviewUrl("");
        setMediaType(null);
        setUploadedMediaUrl("");
        setUploadProgress(0);
      }
    },
    [previewUrl]
  );

  const removeMedia = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setMediaType(null);
    setUploadedMediaUrl("");
    setUploadProgress(0);
  }, [previewUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
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
  };
};
