import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MAX_SIZE_IMAGE_UPLOAD,
  MAX_SIZE_VIDEO_UPLOAD,
} from "~/shared/constants";
import { apiCall } from "~/utils/callApi.util";

// 📸 POST - Upload single image/video (Dynamic endpoint)
export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      // Dynamic endpoint dựa trên file type
      const isImage = file.type.startsWith("image/");
      const endpoint = isImage ? "/api/images" : "/api/videos";

      return apiCall<{ url: string }>(endpoint, {
        method: "POST",
        body: formData,
        // Không set Content-Type để browser tự động set với boundary
      });
    },
    onSuccess: (data, file) => {
      // Invalidate cache dựa trên file type
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        queryClient.invalidateQueries({ queryKey: ["images"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      }
      // Invalidate general media list
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

// 📷 POST - Upload multiple images/videos (Dynamic endpoints)
export const useUploadMultipleMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => {
      // Tách files thành images và videos
      const images = files.filter((file) => file.type.startsWith("image/"));
      const videos = files.filter((file) => !file.type.startsWith("image/"));

      const uploadPromises = [];

      // Upload images nếu có
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((file) => {
          imageFormData.append(`files`, file);
        });

        uploadPromises.push(
          apiCall("/api/img/multiple", {
            method: "POST",
            body: imageFormData,
          })
        );
      }

      // Upload videos nếu có
      if (videos.length > 0) {
        const videoFormData = new FormData();
        videos.forEach((file) => {
          videoFormData.append(`files`, file);
        });

        uploadPromises.push(
          apiCall("/api/media/multiple", {
            method: "POST",
            body: videoFormData,
          })
        );
      }

      // Chờ tất cả upload xong
      return Promise.all(uploadPromises);
    },
    onSuccess: (results, files) => {
      const hasImages = files.some((file) => file.type.startsWith("image/"));
      const hasVideos = files.some((file) => !file.type.startsWith("image/"));

      if (hasImages) {
        queryClient.invalidateQueries({ queryKey: ["images"] });
      }
      if (hasVideos) {
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      }
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

// 🎬 POST - Upload với progress tracking (Dynamic endpoint)
export const useUploadMediaWithProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: number) => void;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      // Dynamic endpoint dựa trên file type
      const isImage = file.type.startsWith("image/");
      const endpoint = isImage ? "/api/images" : "/api/videos";

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch {
              resolve(xhr.responseText);
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("POST", endpoint);
        xhr.send(formData);
      });
    },
    onSuccess: (data, { file }) => {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        queryClient.invalidateQueries({ queryKey: ["images"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      }
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

// 🔍 Validate file trước khi upload
export const validateMediaFile = (file: File) => {
  const allowedImgTypes = ["image/jpeg", "image/jpg", "image/png"];

  const allowedVideoTypes = [
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/mov",
    "video/avi",
  ];

  if (allowedImgTypes.includes(file.type)) {
    if (file.size > MAX_SIZE_IMAGE_UPLOAD) {
      throw new Error("File quá lớn. Tối đa 10MB.");
    }
    return true;
  }

  if (allowedVideoTypes.includes(file.type)) {
    if (file.size > MAX_SIZE_VIDEO_UPLOAD) {
      throw new Error("File quá lớn. Tối đa 50MB.");
    }
    return true;
  }

  throw new Error("Định dạng file không được hỗ trợ.");
};

// 🎯 Hook tiện ích để upload với validation
export const useUploadWithValidation = () => {
  const uploadMutation = useUploadMedia();

  return useMutation({
    mutationFn: async (file: File) => {
      // Validate trước khi upload
      validateMediaFile(file);

      // Thực hiện upload
      return uploadMutation.mutateAsync(file);
    },
  });
};
