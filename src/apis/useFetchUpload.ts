import { useMutation } from "@tanstack/react-query";
import { OkResponse } from "~/shared/classes/response.class";
import {
  CONSTANT_MAX_SIZE_IMAGE_UPLOAD,
  CONSTANT_MAX_SIZE_VIDEO_UPLOAD,
} from "~/shared/constants";
import type { RemoteImagesDto } from "~/shared/dtos/req/upload.dto";
import type { ResUpload } from "~/shared/dtos/res/upload.dto";
import { apiCall } from "~/utils/callApi.util";

export const allowedImgTypes = ["image/jpeg", "image/jpg", "image/png"];

export const allowedVideoTypes = [
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/mov",
  "video/avi",
];

// 📸 POST - Upload single image/video (Dynamic endpoint)
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async (files: File[]): Promise<OkResponse<ResUpload[]>> => {
      // Phân loại files theo type
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const videoFiles = files.filter((file) => file.type.startsWith("video/"));

      const uploadPromises: Promise<ResUpload[]>[] = [];

      // Upload images nếu có
      if (imageFiles.length > 0) {
        const imageFormData = new FormData();
        imageFiles.forEach((file) => {
          imageFormData.append("images", file);
        });

        const imageUpload = apiCall<ResUpload[]>("/uploads/images", {
          method: "POST",
          body: imageFormData,
        }).then((response) => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            return response.metadata || [];
          }
          throw new Error(response.message);
        });

        uploadPromises.push(imageUpload);
      }

      // Upload videos nếu có
      if (videoFiles.length > 0) {
        const videoFormData = new FormData();
        videoFiles.forEach((file) => {
          videoFormData.append("videos", file);
        });

        const videoUpload = apiCall<ResUpload[]>("/uploads/videos", {
          method: "POST",
          body: videoFormData,
        }).then((response) => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            return response.metadata || [];
          }
          throw new Error(response.message);
        });

        uploadPromises.push(videoUpload);
      }

      // Chờ tất cả uploads hoàn thành và merge kết quả
      const results = await Promise.all(uploadPromises);
      return new OkResponse("Success", results.flat()); // Merge tất cả string[] thành một string[] duy nhất
    },
    onSuccess: () => {
      console.log("Uploaded success");
    },
  });
};

// 🔍 Validate file trước khi upload
export const validateMediaFile = (file: File) => {
  if (allowedImgTypes.includes(file.type)) {
    if (file.size > CONSTANT_MAX_SIZE_IMAGE_UPLOAD) {
      throw new Error("Dung lượng ảnh quá lớn. Tối đa 5MB.");
    }
    return true;
  }

  if (allowedVideoTypes.includes(file.type)) {
    if (file.size > CONSTANT_MAX_SIZE_VIDEO_UPLOAD) {
      throw new Error("Dung lượng video quá lớn. Tối đa 10MB.");
    }
    return true;
  }

  throw new Error("Định dạng không được hỗ trợ.");
};

// 🎯 Hook tiện ích để upload với validation
export const useUploadWithValidation = () => {
  const uploadMutation = useUploadMedia();

  return useMutation({
    mutationFn: async (files: File[]) => {
      // Validate trước khi upload
      files.forEach((file) => validateMediaFile(file));

      // Thực hiện upload
      return uploadMutation.mutateAsync(files);
    },
  });
};

// 🎯 Hook để xóa nhiều ảnh từ urls
export const useRemoveImages = () => {
  return useMutation({
    mutationFn: async (credentials: RemoteImagesDto) =>
      apiCall("/uploads/remove/images", {
        method: "DELETE",
        body: JSON.stringify(credentials),
      }),
  });
};
