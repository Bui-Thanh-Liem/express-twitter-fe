import { useCallback, useEffect, useState } from "react";
import {
  MAX_SIZE_IMAGE_UPLOAD,
  MAX_SIZE_VIDEO_UPLOAD,
} from "~/shared/constants";
import { EMediaType } from "~/shared/enums/type.enum";
import { toastSimple } from "~/utils/toastSimple.util";

export const MAX_FILE_COUNT = 5;

export interface MediaItem {
  id: string;
  file: File;
  previewUrl: string;
  mediaType: EMediaType;
  uploadProgress: number;
}

export const useMediaPreviewMulti = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

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

      setMediaItems((prev) => {
        const currentCount = prev.length;
        const remainingSlots = MAX_FILE_COUNT - currentCount;

        if (newFiles.length > remainingSlots) {
          toastSimple(
            `Chỉ được tải tối đa ${MAX_FILE_COUNT} hình ảnh hoặc video.`,
            "warning"
          );
        }

        const filesToProcess = newFiles.slice(0, remainingSlots);
        const newMediaItems: MediaItem[] = [];

        let idCounter = 0; // ✅ Counter để đảm bảo ID unique trong cùng batch

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

          // ✅ ID duy nhất với timestamp + counter + random
          const id = `${Date.now()}-${idCounter++}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;

          newMediaItems.push({
            id,
            file,
            previewUrl: URL.createObjectURL(file),
            mediaType: type!,
            uploadProgress: 0,
          });
        }

        if (!newMediaItems.length) return prev;

        return [...prev, ...newMediaItems];
      });
    },
    [] // ✅ Không cần dependency vì dùng functional update
  );

  const removeMedia = useCallback((id?: string) => {
    if (id) {
      setMediaItems((prev) => {
        const itemToRemove = prev.find((item) => item.id === id);
        if (itemToRemove) {
          URL.revokeObjectURL(itemToRemove.previewUrl);
        }
        return prev.filter((item) => item.id !== id);
      });
    } else {
      setMediaItems((prev) => {
        prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        return [];
      });
    }
  }, []); // ✅ Không cần dependency

  const updateUploadProgress = useCallback((id: string, progress: number) => {
    setMediaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, uploadProgress: progress } : item
      )
    );
  }, []); // ✅ Không cần dependency

  useEffect(() => {
    return () => {
      mediaItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [mediaItems]);

  return {
    mediaItems,
    selectedFiles: mediaItems.map((item) => item.file),
    previewUrls: mediaItems.map((item) => item.previewUrl),
    mediaTypes: mediaItems.map((item) => item.mediaType),
    uploadProgress: mediaItems.map((item) => item.uploadProgress),
    handleFileChange,
    removeMedia,
    updateUploadProgress,
    formatFileSize,
    MAX_FILE_COUNT,
  };
};
