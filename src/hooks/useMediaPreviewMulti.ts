import { useCallback, useEffect, useState } from "react";
import {
  MAX_SIZE_IMAGE_UPLOAD,
  MAX_SIZE_VIDEO_UPLOAD,
} from "~/shared/constants";
import { EMediaType } from "~/shared/enums/type.enum";
import { toastSimple } from "~/utils/toastSimple.util";

export const MAX_FILE_COUNT = 5; // 👈 Giới hạn tối đa bao nhiêu file có thể chọn

export const useMediaPreviewMulti = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<EMediaType[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

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
      const newFiles = Array.from(e.target.files || []);
      if (!newFiles.length) return;

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

      const currentCount = selectedFiles.length;
      const remainingSlots = MAX_FILE_COUNT - currentCount;

      if (newFiles.length > remainingSlots) {
        toastSimple(
          `Chỉ được tải tối đa ${MAX_FILE_COUNT} hình ảnh hoặc video.`,
          "warning"
        );
      }

      const filesToProcess = newFiles.slice(0, remainingSlots);

      const validFiles: File[] = [];
      const urls: string[] = [];
      const types: EMediaType[] = [];

      for (const file of filesToProcess) {
        const type = getMediaType(file);

        if (
          !validImageTypes.includes(file.type) &&
          !validVideoTypes.includes(file.type)
        ) {
          toastSimple(
            "Chỉ hỗ trợ file ảnh (JPEG, PNG, GIF, WebP) và video (MP4, WebM, MOV, AVI)",
            "warning"
          );
          continue;
        }

        const maxSize =
          type === EMediaType.Video
            ? MAX_SIZE_VIDEO_UPLOAD
            : MAX_SIZE_IMAGE_UPLOAD;

        if (file.size > maxSize) {
          const type_vn = type === EMediaType.Video ? "Video" : "Hình ảnh";
          const sizeLimitText = type === EMediaType.Video ? "10MB" : "5MB";
          toastSimple(
            `${type_vn} không được vượt quá ${sizeLimitText}, ${type_vn} bạn định tải lên: ${formatFileSize(
              file.size
            )}`,
            "warning"
          );
          continue;
        }

        validFiles.push(file);
        urls.push(URL.createObjectURL(file));
        types.push(type!);
      }

      if (!validFiles.length) return;

      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviewUrls((prev) => [...prev, ...urls]);
      setMediaTypes((prev) => [...prev, ...types]);
      setUploadProgress((prev) => [
        ...prev,
        ...new Array(validFiles.length).fill(0),
      ]);
    },
    [selectedFiles]
  );

  const removeMedia = useCallback(
    (index?: number) => {
      if (typeof index === "number") {
        URL.revokeObjectURL(previewUrls[index]);
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
        setMediaTypes((prev) => prev.filter((_, i) => i !== index));
        setUploadProgress((prev) => prev.filter((_, i) => i !== index));
      } else {
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setPreviewUrls([]);
        setMediaTypes([]);
        setUploadProgress([]);
      }
    },
    [previewUrls]
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return {
    selectedFiles,
    previewUrls,
    mediaTypes,
    uploadProgress,
    setUploadProgress,
    handleFileChange,
    removeMedia,
    formatFileSize,
    MAX_FILE_COUNT,
  };
};
